# nhs-interactive <img style="float: right; padding: 10px;" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FWORTI31212%2Fnhs-interactive&count_bg=%23005CB8&title_bg=%23555555&icon=&icon_color=%23EB0000&title=VIEWS&edge_flat=false">

![landing](./app/opengraph-image.png)

A ChatGPT POC built within the NHS Front-end toolkit and React components.

## Run the app

Clone the repo.
Install the project dependencies:

```bash
npm i
```

Run the app:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Optional DB integration

You can run the pocketbase executable from the root dir.

```bash
./pocketbase serve
```

## Configuration

File: `.env.{environment}`

Options:

```bash
OPENAI_API_KEY: string;
DB_STORE: boolean;
DB_URL: string;
```
