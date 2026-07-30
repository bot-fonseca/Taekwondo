"""
scraper_tkd.py — Descarregador de imagens para Taekwondo Terminology Reference App

USO:
  python scraper_tkd.py download   → descarrega imagens das páginas configuradas para
                                     'downloaded_images/{categoria}/' e gera
                                     'image_mapping_template.json'

  python scraper_tkd.py apply      → lê 'image_mapping.json' (editado por ti) e copia
                                     as imagens para 'public/images/techniques/'
                                     com o nome do ID da técnica (ex: ck-ap-chagi.jpg)

WORKFLOW:
  1. Corre 'download' → verifica as imagens em 'downloaded_images/'
  2. Copia 'image_mapping_template.json' para 'image_mapping.json'
  3. Abre 'image_mapping.json' e preenche cada ID de técnica com o nome
     do ficheiro correspondente (ex: "ck-ap-chagi": "frontKick.jpg")
  4. Corre 'apply' → as imagens ficam em 'public/images/techniques/'
  5. A app carrega-as automaticamente
"""

import os
import sys
import json
import shutil
import requests
import re
from urllib.parse import urljoin

# ── Páginas fonte por categoria ──────────────────────────────────
# Adiciona ou substitui URLs conforme encontrares melhores fontes.
PAGINAS_FONTE = {
    "seogi":    "https://www.taekwondopreschool.com/stances.html",
    "jireugi":  "https://www.taekwondopreschool.com/punchesandstrikes.html",
    "makgi":    "https://www.taekwondopreschool.com/blocks.html",
    "chagi":    "https://www.taekwondopreschool.com/kicks.html",
}

# ── IDs de técnicas agrupados por categoria ──────────────────────
# Devem corresponder exactamente aos IDs em src/app/data/taekwondo.ts
TECNICAS_POR_CATEGORIA = {
    "seogi": [
        "sq-charyeot", "sq-narani", "sq-juchum", "sq-ap",
        "sq-apkubi", "sq-dwitkubi", "sq-beom", "sq-koa",
    ],
    "jireugi": [
        "at-momtong-jireugi", "at-eolgul-jireugi", "at-arae-jireugi",
        "at-dubeon-jireugi", "at-sonnal-chigi", "at-deung-jumeok",
        "at-palkup-chigi", "at-pyeonsonkeut",
    ],
    "makgi": [
        "bl-arae-makgi", "bl-momtong-makgi", "bl-eolgul-makgi",
        "bl-an-makgi", "bl-bakat-makgi", "bl-sonnal-makgi",
        "bl-hecho-makgi", "bl-gawi-makgi",
    ],
    "chagi": [
        "ck-ap-chagi", "ck-dollyo-chagi", "ck-yeop-chagi", "ck-dwit-chagi",
        "ck-naeryeo-chagi", "ck-bandal-chagi", "ck-huryeo-chagi", "ck-dwit-huryeo",
    ],
}

PASTA_STAGING    = "./downloaded_images"
PASTA_PUBLICA    = "./public/images/techniques"
FICHEIRO_TEMPLATE = "./image_mapping_template.json"
FICHEIRO_MAPPING  = "./image_mapping.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}
EXTENSOES_IMAGEM = r'[\"\']([^\"\']*\.(?:jpg|jpeg|png|gif|webp))[\"\']'
IGNORAR_SE_CONTEM = ("logo", "icon", "banner", "favicon", "sprite", "button")


# ── Fase 1: download ─────────────────────────────────────────────

def descarregar_pagina(categoria, url):
    """Descarrega todas as imagens de uma página para downloaded_images/{categoria}/"""
    pasta = os.path.join(PASTA_STAGING, categoria)
    os.makedirs(pasta, exist_ok=True)

    print(f"\n[{categoria}] A aceder a: {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERRO ao aceder à página: {e}")
        return []

    links_brutos = re.findall(EXTENSOES_IMAGEM, resp.text, re.IGNORECASE)
    links_unicos = list(dict.fromkeys(links_brutos))  # remove duplicados, mantém ordem

    descarregados = []
    for link in links_unicos:
        link_lower = link.lower()
        if any(palavra in link_lower for palavra in IGNORAR_SE_CONTEM):
            continue

        img_url = urljoin(url, link)
        nome_ficheiro = img_url.split("/")[-1].split("?")[0]
        caminho = os.path.join(pasta, nome_ficheiro)

        try:
            dados = requests.get(img_url, headers=HEADERS, timeout=15).content
            with open(caminho, "wb") as f:
                f.write(dados)
            print(f"  ✓ {nome_ficheiro}")
            descarregados.append(nome_ficheiro)
        except Exception as e:
            print(f"  ✗ {img_url}: {e}")

    return descarregados


def cmd_download():
    imagens_por_categoria = {}

    for categoria, url in PAGINAS_FONTE.items():
        imagens = descarregar_pagina(categoria, url)
        imagens_por_categoria[categoria] = imagens

    # Gera o ficheiro template JSON
    tecnicas_mapping = {}
    for categoria, ids in TECNICAS_POR_CATEGORIA.items():
        for tid in ids:
            tecnicas_mapping[tid] = None  # o utilizador preenche depois

    template = {
        "_instrucoes": (
            "Preenche cada ID com o nome do ficheiro descarregado "
            "(ex: 'ck-ap-chagi': 'frontKick.jpg'). "
            "Deixa null para técnicas sem imagem. "
            "Guarda como image_mapping.json e corre: python scraper_tkd.py apply"
        ),
        "tecnica_para_imagem": tecnicas_mapping,
        "imagens_disponiveis": imagens_por_categoria,
    }

    with open(FICHEIRO_TEMPLATE, "w", encoding="utf-8") as f:
        json.dump(template, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Download concluído.")
    print(f"   Imagens em:   {PASTA_STAGING}/")
    print(f"   Template em:  {FICHEIRO_TEMPLATE}")
    print(f"\n➡  Próximo passo:")
    print(f"   1. Copia '{FICHEIRO_TEMPLATE}' para '{FICHEIRO_MAPPING}'")
    print(f"   2. Preenche os IDs com os nomes das imagens certas")
    print(f"   3. Corre: python scraper_tkd.py apply")


# ── Fase 2: apply ────────────────────────────────────────────────

def cmd_apply():
    if not os.path.exists(FICHEIRO_MAPPING):
        print(f"ERRO: '{FICHEIRO_MAPPING}' não encontrado.")
        print(f"Copia '{FICHEIRO_TEMPLATE}' para '{FICHEIRO_MAPPING}', preenche-o e tenta de novo.")
        sys.exit(1)

    with open(FICHEIRO_MAPPING, encoding="utf-8") as f:
        dados = json.load(f)

    mapping = dados.get("tecnica_para_imagem", {})
    os.makedirs(PASTA_PUBLICA, exist_ok=True)

    copiados = 0
    ignorados = 0
    for tid, nome_ficheiro in mapping.items():
        if not nome_ficheiro:
            ignorados += 1
            continue

        # Procura o ficheiro em qualquer subpasta de downloaded_images/
        origem = None
        for categoria in TECNICAS_POR_CATEGORIA:
            candidato = os.path.join(PASTA_STAGING, categoria, nome_ficheiro)
            if os.path.exists(candidato):
                origem = candidato
                break

        if not origem:
            print(f"  ✗ Ficheiro não encontrado: {nome_ficheiro}  (técnica: {tid})")
            continue

        ext = os.path.splitext(nome_ficheiro)[1].lower()
        destino = os.path.join(PASTA_PUBLICA, f"{tid}{ext}")
        shutil.copy2(origem, destino)
        print(f"  ✓ {tid}{ext}")
        copiados += 1

    print(f"\n✅ {copiados} imagens copiadas para {PASTA_PUBLICA}/")
    if ignorados:
        print(f"   {ignorados} técnicas ficaram sem imagem (null no mapping).")
    print(f"\n   A app carrega automaticamente /images/techniques/{{id}}.jpg")


# ── Entrada principal ────────────────────────────────────────────

if __name__ == "__main__":
    comando = sys.argv[1] if len(sys.argv) > 1 else ""

    if comando == "download":
        cmd_download()
    elif comando == "apply":
        cmd_apply()
    else:
        print("Uso: python scraper_tkd.py [download|apply]")
        print()
        print("  download  — descarrega imagens e gera image_mapping_template.json")
        print("  apply     — lê image_mapping.json e copia imagens para public/")
        sys.exit(1)