---
name: requirements-lite
description: generate lightweight requirement documents for small or medium software changes without invoking a full spec kit workflow. use when the user writes /req-lite or asks to turn a brief feature request, bug fix, crud, field addition, report, api adjustment, genexus change, or simple business rule into a concise requirement file with objective, fields, business rules, acceptance criteria, technical notes, and a suggested path such as requisitos/RF001-cadastro-cliente.md.
---

# Requirements Lite

Use this skill to convert short implementation requests into compact requirement documentation. Keep the output proportional: one requirement document, no full spec kit structure, no research file, no plan file, no contracts folder, unless the user explicitly asks.

## Command

Recognize this command pattern:

```text
/req-lite <short request>
```

Also use the same workflow when the user asks to create a small requirement, requisito pequeno, requisito enxuto, mini requisito, or requirement-lite document.

## Output contract

Return exactly two sections:

1. `Caminho sugerido`
2. `Requisito`

Use this markdown template for the requirement:

```markdown
# RFNNN - Titulo Do Requisito

## Objetivo
<one short paragraph explaining the expected user/business outcome>

## Campos
- <field name>: <required/optional, type or format if known, validation if relevant>

## Regras de Negocio
- <business rule>

## Criterios de Aceite
- <testable acceptance criterion>

## Observacoes Tecnicas
- <technical note, constraint, implementation hint, integration note, or "Nao informado" when there is no relevant note>
```

## Numbering and path rules

- If the user provides an RF number, preserve it.
- If no number is provided, use `RF001`.
- Generate a lowercase kebab-case filename from the title.
- Suggest the path as `requisitos/RFNNN-<slug>.md`.
- Keep accents out of slugs: `cadastro-cliente`, `emissao-nota`, `integracao-ginfes`.

## Scope rules

- Keep the requirement short enough to be useful in a project repository.
- Prefer 3 to 8 business rules.
- Prefer 3 to 8 acceptance criteria.
- Do not create `plan.md`, `tasks.md`, `research.md`, data models, or contracts unless explicitly requested.
- Do not invent excessive fields or business complexity. Infer only obvious details from the request.
- When a key detail is missing but not blocking, write a reasonable placeholder as a technical note or acceptance criterion instead of asking a follow-up.
- Ask a follow-up only when the requested feature cannot be meaningfully documented without the missing information.

## Style rules

- Write in Portuguese unless the user writes in another language.
- Use clear business language first, technical language second.
- Make criteria testable: start with "Deve...", "Nao deve...", or "Quando...".
- For GeneXus projects, mention GeneXus only in technical notes when the request clearly involves GeneXus objects, transactions, procedures, web panels, APIs, or SDTs.
- Preserve domain terms supplied by the user.

## Example

User:

```text
/req-lite criar cadastro de cliente com nome, cpf, email e telefone. cpf deve ser unico.
```

Assistant:

```markdown
## Caminho sugerido

`requisitos/RF001-cadastro-cliente.md`

## Requisito

# RF001 - Cadastro de Cliente

## Objetivo
Permitir o cadastro, consulta, edicao e exclusao de clientes, mantendo os dados basicos necessarios para identificacao e contato.

## Campos
- Nome: obrigatorio.
- CPF: obrigatorio, deve possuir formato valido e ser unico.
- Email: opcional, deve possuir formato valido quando informado.
- Telefone: opcional.

## Regras de Negocio
- O CPF deve ser unico no cadastro de clientes.
- Nao deve ser permitido cadastrar cliente sem nome.
- Nao deve ser permitido cadastrar cliente com CPF invalido.
- O cliente deve poder ser editado mantendo as mesmas validacoes do cadastro.

## Criterios de Aceite
- Deve cadastrar um cliente quando todos os campos obrigatorios forem validos.
- Deve bloquear o cadastro quando o CPF ja estiver cadastrado.
- Deve bloquear o cadastro quando o nome nao for informado.
- Deve permitir alterar email e telefone de um cliente existente.

## Observacoes Tecnicas
- Implementar as validacoes no ponto central de gravacao para evitar inconsistencias entre telas ou APIs.
```
