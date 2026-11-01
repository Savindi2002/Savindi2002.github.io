# Savindi Hewage — Portfolio Refresh

## Files
- `index.html` — website content and sections
- `style.css` — responsive navy / blue / teal visual theme
- `script.js` — navigation, scroll progress, reveal effects, role typing, animated network and email-draft form
- `assets/announcing/` — four announcing/public-speaking photos
- `assets/awards/` — four certificate images

## Add your images
Copy your professional portrait into the project root and name it exactly:
- `savindi professional photo.png`

Add your four announcing photos:
- `assets/announcing/announcing-1.jpg`
- `assets/announcing/announcing-2.jpg`
- `assets/announcing/announcing-3.jpg`
- `assets/announcing/announcing-4.jpg`

Add up to four competition certificate images:
- `assets/awards/certificate-1.jpg`
- `assets/awards/certificate-2.jpg`
- `assets/awards/certificate-3.jpg`
- `assets/awards/certificate-4.jpg`

If you have PNG files, either convert them to JPG or update the corresponding `.jpg` filename in `index.html`.

## Before publishing
1. Confirm your CGPA is still 3.14 as written in the CV.
2. Replace the Instagram URL in `index.html` with your exact Instagram profile URL.
3. Check each project repository URL. Links for projects whose exact repository URL was not present in the supplied CV point to your GitHub repositories page for now.
4. Review the wording and add your four event photos and certificate scans.
5. Open `index.html` in a browser and test the mobile menu, all links and the contact form. The contact form opens the visitor's email application; it does not send mail directly from the website.

## Safe Git workflow — preserve your current website
Run these commands from your existing portfolio repository before replacing any files:

```bash
git status
git switch -c portfolio-redesign
git add -A
git commit -m "Backup current portfolio before redesign"
```

The new branch is separate from your existing branch. Then copy the refreshed `index.html`, `style.css`, `script.js`, and `assets/` into your repository. Test locally, then:

```bash
git add .
git commit -m "Redesign portfolio with updated CV content"
git push -u origin portfolio-redesign
```

To return to your original version at any time:

```bash
git switch main
```

If your default branch is named `master`, use `git switch master` instead. Do not delete the original branch.


## Your photo filenames

Place these files in the folders below. The site automatically tries `.jpg`, `.jpeg`, `.png`, and `.webp` extensions (uppercase extensions are supported too).

- `assets/announcing/announcing`
- `assets/announcing/anora`
- `assets/announcing/himidiriya`
- `assets/announcing/wie photo`
- `assets/awards/award photo`

Keep the spaces in `wie photo` and `award photo` if those are the names of your files. The professional portrait remains in the project root as `savindi professional photo.png`.
