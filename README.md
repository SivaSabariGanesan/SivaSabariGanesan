<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:58A6FF,100:1F6FEB&height=200&section=header&text=Hi%20there,%20I'm%20Sabari%20👋&fontSize=34&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Code%20%2B%20Coffee%20%3D%20❤️&descAlignY=58&descSize=18" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=58A6FF&center=true&vCenter=true&width=600&lines=Full-Stack+Developer;React+%7C+Next.js+%7C+Node.js+%7C+Django;Website+Lead+%40+Titanium+Fest;Ops+Head+%40+DEVS-REC+Tech+Team" alt="Typing SVG" />

Welcome to my GitHub profile! Here you'll find my projects and contributions to the world of software development.

</div>

---

### 🚀 Technologies I'm Working With

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,nextjs,tailwind,nodejs,express,flask,django&theme=dark" />
</p>
<p align="left">
  <img src="https://skillicons.dev/icons?i=js,ts,java,python,postgres,mongodb,firebase,redis&theme=dark" />
</p>

---

### 📫 How to Reach Me

<p align="left">
  <a href="mailto:asivasabariganesan@gmail.com">
    <img src="https://img.shields.io/badge/-Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://linkedin.com/in/siva-sabari-ganesan-a-b3288a28b">
    <img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/SivaSabariGanesan">
    <img src="https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

---

### 📊 GitHub Stats

<div align="center">
  <img src="./profile/stats.svg" width="48%" alt="Sabari's GitHub stats" />
  <img src="./profile/top-langs.svg" width="38%" alt="Sabari's top languages" />
</div>

### 🏆 GitHub Trophies

<div align="center">
  <img src="./profile/trophies.svg" alt="Sabari's GitHub trophies" />
</div>

### 🔥 GitHub Streak

<div align="center">
  <img src="./profile/streak.svg" width="60%" alt="Sabari's GitHub streak" />
</div>

### 🧊 Animated 3D Contribution Calendar

<div align="center">
  <img src="./profile/3d-contrib/profile-night-rainbow.svg" width="90%" alt="Sabari's animated 3D contribution calendar" />
</div>

### 🐍 Contribution Snake

<div align="center">
  <img src="https://raw.githubusercontent.com/SivaSabariGanesan/SivaSabariGanesan/output/github-contribution-grid-snake-dark.svg" width="90%" alt="Sabari's contribution snake" />
</div>

---

### ⚡ Fun Facts

- 🏟️ Built an event platform (Titanium Fest) that handled **13K+ users / 41K+ unique visitors** with zero downtime
- 🏆 Hackathon winner — Circuity 2024, Saveetha Engineering College; Top 6 at IIT Kanpur's BuzzOnEarth
- 🎮 Currently exploring game development on the side
- ☕ I love coding and coffee, always learning something new

---

<div align="center">

Thanks for visiting my profile! Feel free to check out my repositories and get in touch.

<img src="https://komarev.com/ghpvc/?username=SivaSabariGanesan&label=Profile%20views&color=58A6FF&style=flat" />

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1F6FEB,100:58A6FF&height=120&section=footer" width="100%" />

</div>

---

<details>
<summary>⚙️ One-time setup — everything above (except the header/typing SVG/icons/badges) is now GitHub-Actions-generated</summary>

All the "live GitHub data" widgets — Stats, Top Languages, Trophies, Streak, and the 3D contribution calendar — now render from **static SVGs committed directly into this repo** by a single scheduled workflow, instead of hitting a third-party server on every page load. This is the fix for the broken/blank images from before: those relied on shared public instances (`github-readme-stats.vercel.app`, `github-profile-trophy.vercel.app`) that keep getting rate-limited or paused. Generating locally removes that dependency entirely — nothing to go down.

**1. Add the workflow.** Create `.github/workflows/profile-widgets.yml` in the `SivaSabariGanesan/SivaSabariGanesan` repo:

```yaml
name: Update Profile Widgets

on:
  schedule:
    - cron: "0 0 * * *"   # daily at midnight UTC
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  update-widgets:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Generate GitHub stats card
        uses: readme-tools/github-readme-stats-action@v1
        with:
          card: stats
          options: username=${{ github.repository_owner }}&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=58A6FF&icon_color=58A6FF&count_private=true
          path: profile/stats.svg
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate top languages card
        uses: readme-tools/github-readme-stats-action@v1
        with:
          card: top-langs
          options: username=${{ github.repository_owner }}&layout=compact&theme=dark&hide_border=true&bg_color=0D1117&title_color=58A6FF&langs_count=8
          path: profile/top-langs.svg
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate trophies
        uses: Erik-Donath/github-profile-trophy@feature/generate-svg
        with:
          username: ${{ github.repository_owner }}
          output_path: profile/trophies.svg
          theme: darkhub
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate streak stats
        uses: DenverCoder1/github-readme-streak-stats@main
        with:
          options: user=${{ github.repository_owner }}&theme=dark&hide_border=true&background=0D1117&ring=58A6FF&fire=58A6FF&currStreakLabel=58A6FF
          path: profile/streak.svg
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate animated 3D contribution calendar
        uses: yoshi389111/github-profile-3d-contrib@0.7.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          username: ${{ github.repository_owner }}
          svg_out_dir: profile/3d-contrib

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add profile/
          git diff --cached --quiet || git commit -m "chore: update profile widgets"
          git push
```

**2. Add the snake workflow too** (separate file, `.github/workflows/snake.yml`), if you don't have it already:

```yaml
name: Generate Snake
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: Platane/snk@v3
        id: snake
        with:
          github_user_name: SivaSabariGanesan
          outputs: |
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
            dist/github-contribution-grid-snake.svg
      - uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**3. Enable write permissions.** Repo → Settings → Actions → General → Workflow permissions → **Read and write permissions**. Without this the commit-and-push step fails.

**4. Run both workflows once manually** — Actions tab → select each workflow → *Run workflow*. After that they run automatically every night, so the cards stay fresh with zero third-party dependency.

**5. Push this README.** The `./profile/...` paths are relative to the repo root, so they'll resolve automatically once the first run commits the `profile/` folder.

If any single card ever fails to generate (e.g. an action gets deprecated), the rest keep working independently since each is its own step — replace just that one step rather than the whole workflow.

</details>
