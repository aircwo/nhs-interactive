# nhs-interactive <img style="float: right; padding: 10px;" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FWORTI31212%2Fnhs-interactive&count_bg=%23005CB8&title_bg=%23555555&icon=&icon_color=%23EB0000&title=VIEWS&edge_flat=false">

![landing](./app/opengraph-image.png)

A ChatGPT POC built within the NHS Front-end toolkit and React components.

> **Note**
> This app is for educational purposes only.

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

> This app was split into a front and backend API. This was to make the consumption of health data easier.
> You will need the API running in order to perform search requests.

Optional DB integration

You can run the pocketbase executable from the root dir.

```bash
./pocketbase serve
```

## Configuration

File: `.env.{environment}`

Options:

```bash
DB_STORE: boolean;
DB_URL: string;
HEALTH_AI_API_KEY: string;
HEALTH_AI_API_URL: string;
HEALTH_AI_API_HEALTH_CHECK_URL: string;
```
