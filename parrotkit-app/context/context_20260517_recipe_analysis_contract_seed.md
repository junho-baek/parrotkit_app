# 2026-05-17 Recipe Analysis Contract Seed

## 배경

The user provided nine Sandcastle AI screenshots and asked to preserve the durable recipe guidance that ParrotKit should learn from that product. The key product decision was:

- Primary: `A` Recipe Analysis Contract.
- Future-facing: `D` Reference Intelligence Layer for many-video analysis.

## Ouroboros CLI 시도

MCP tool search did not expose `ouroboros_auto` or `ouroboros_interview`, but the local CLI existed:

- `ouroboros` path: `/Users/junho/.local/bin/ouroboros`
- `ooo` alias: not found
- `uv tool list`: `ouroboros-ai v0.1.dev1`

Ran:

```bash
ouroboros auto "Create an A-grade Seed for ParrotKit recipe reference-video analysis..." --skip-run --max-interview-rounds 8 --max-repair-rounds 4 --show-ledger --timeout 900
```

Then resumed the same auto session multiple times:

```bash
ouroboros auto --resume auto_b0a0703c1c5b --skip-run --max-interview-rounds 10 --max-repair-rounds 4 --show-ledger
```

Result:

- Auto session: `auto_b0a0703c1c5b`
- Interview session: `interview_ca635fee86514c4b`
- The CLI reached 10 interview rounds.
- It repeatedly blocked with `interview phase exceeded 120s`.
- No A-grade Ouroboros seed was generated.
- Saved interview data is in `/Users/junho/.ouroboros/data/interview_interview_ca635fee86514c4b.json`.

## 결정

The CLI interview drifted toward a conservative local CLI/JSON MVP. That is useful for future implementation verification, but it is not the user's main intent. The seed was therefore written manually as a product/spec seed using:

- user decision: A primary, D future-facing
- Sandcastle screenshot analysis
- partial Ouroboros interview artifacts
- `parrotkit-app/DESIGN.md`
- existing reference recipe and shooting board context

## 산출물

- `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`
- `parrotkit-app/plans/20260517_recipe_analysis_contract_seed.md`

## 검증

PASS:

- `ruby -e 'require "yaml"; YAML.load_file("parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml"); puts "yaml ok"'`
- `git diff --check`
