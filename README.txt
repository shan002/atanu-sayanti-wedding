ATANU & SAYONTI — WEDDING INVITATION V8
========================================

PUBLIC URLS AFTER DEPLOYMENT
----------------------------
Wedding only (default):
https://atanu-sayanti-wedding.vercel.app/

Wedding + Reception:
https://atanu-sayanti-wedding.vercel.app/wedding-reception/

Wedding + Reception + Color Fest:
https://atanu-sayanti-wedding.vercel.app/all/

LOCAL TEST URLS
---------------
Wedding only:
http://localhost:8000/

Wedding + Reception:
http://localhost:8000/wedding-reception/

Wedding + Reception + Color Fest:
http://localhost:8000/all/

Personalized example:
http://localhost:8000/?to=Shan

HOW TO RUN LOCALLY
------------------
1. Open Command Prompt / Windows Terminal in the main project folder.
2. Run:
   py -m http.server 8000
3. Open one of the local URLs above.
4. Stop the server with Ctrl+C.

PHOTO FILES — EXACT NAMES
-------------------------
Keep your existing six photos with these names:

images/hero.jpg              wide top hero photo
images/couple.jpg            tall photo beside "A Sacred Beginning"
images/pic-1.jpg             large LEFT photo in "A Little Bit of Us"
images/pic-2.jpg             small UPPER-MIDDLE gallery photo
images/pic-3.jpg             small UPPER-RIGHT gallery photo
images/pic-4.jpg             wide MIDDLE/LOWER-RIGHT gallery photo

Rename the THREE NEW photos as follows:

images/save-the-date.jpg     the separate photo used with "Save the Dates"
images/pic-5.jpg             full-body portrait in black shirt + red dress
images/pic-6.jpg             close portrait under the white drape with bouquet

Desktop gallery placement:
- pic-1 = large left anchor
- pic-2 = upper middle
- pic-3 = upper right
- pic-4 = wide row across middle/right
- pic-5 = portrait, lower-left of the new portrait pair
- pic-6 = portrait, lower-right of the new portrait pair

On phones the same six photos rearrange into a clean two-column collage.

IMPORTANT: this ZIP intentionally does not replace your personal original JPGs.
Copy your current hero.jpg, couple.jpg and pic-1.jpg through pic-4.jpg into /images,
then add the three new files above.

FAST FIRST LOAD + FULL QUALITY AFTERWARD
----------------------------------------
The site first loads optimized copies, then (after the page has loaded) quietly
preloads and swaps in your original full-resolution files.

After adding/replacing photos, run this once if Pillow is not installed:
   py -m pip install Pillow

Then run:
   py tools/optimize-images.py

This creates:
   images/optimized/hero-1600.jpg
   images/optimized/couple-900.jpg
   images/optimized/save-the-date-1200.jpg
   images/optimized/pic-1-900.jpg ... pic-6-900.jpg

Do NOT delete your original files in /images.

To disable the later full-resolution upgrade, open assets/config.js and set:
   loadFullResolutionAfterInitial: false

AUDIO
-----
Audio file:
assets/wedding_background.mp3

To use a different MP3:
1. Put the new MP3 in /assets.
2. Open assets/config.js.
3. Change:
   musicFile: "/assets/your-song.mp3"

VOLUME
Set in assets/config.js:
   musicVolume: 0.35

Examples:
   0.20 = quiet
   0.35 = current default
   0.50 = louder
   1.00 = full volume

MOBILE AUDIO BEHAVIOR
---------------------
The music pauses when the page/webview is hidden, backgrounded, blurred,
navigated away from, or closed. It does not automatically resume after you
leave the page; the guest can tap the floating music button to resume.

RSVP — SAVE DIRECTLY TO A GOOGLE SHEET
--------------------------------------
The form no longer asks for number of guests.

Wedding-only invitation:
- asks only whether the guest can attend the wedding
- does NOT ask which event they will attend

Multi-event invitations:
- show only the events allowed by that invitation link

The website can save RSVP responses directly to a private Google Sheet without
opening WhatsApp, Messenger, or an email app.

The RSVP stores:
- timestamp
- guest name
- attending / unable to attend
- selected events on multi-event invitations
- optional message
- invitation type
- personalized-link name, if used
- page URL

GOOGLE SHEET SETUP
1. Create a blank Google Sheet.
2. Choose Extensions > Apps Script.
3. Delete the sample code.
4. Open this project file:
   google-apps-script/Code.gs
5. Copy all of it into Apps Script.
6. Deploy > New deployment.
7. Select: Web app.
8. Execute as: Me.
9. Who has access: Anyone.
10. Deploy and authorize.
11. Copy the Web app URL ending in /exec.
12. Open assets/config.js.
13. Paste it into:

   sheetEndpoint: "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"

OPTIONAL AUTOMATIC EMAIL
------------------------
Open google-apps-script/Code.gs and change:
   const EMAIL_RECIPIENT = '';

to the email address that should receive every RSVP, for example:
   const EMAIL_RECIPIENT = 'your-email@example.com';

Then redeploy the Apps Script as a new version. The guest still stays on the
website; Google sends the email in the background.

The Sheet can later be exported as CSV:
File > Download > Comma Separated Values (.csv)

WHERE TO CHANGE THINGS
----------------------
Wedding/event/family text:
   assets/config.js

Audio filename / volume:
   assets/config.js

Main website behavior:
   assets/app.js

Colors/layout/animation/design:
   assets/styles.css

Photos:
   images/

Google Sheet receiver / optional RSVP email:
   google-apps-script/Code.gs

HOW TO CHANGE A PHOTO
---------------------
1. Replace the matching original JPG inside /images.
2. Keep the exact filename.
3. Run:
   py tools/optimize-images.py
4. Test locally:
   py -m http.server 8000
5. Stop with Ctrl+C.
6. Deploy:
   git status
   git add .
   git commit -m "Update wedding photos"
   git push

HOW TO CHANGE ANY CODE/TEXT FILE
--------------------------------
1. Edit the file and save it.
2. Start local server:
   py -m http.server 8000
3. Test all invitation URLs.
4. Stop server with Ctrl+C.
5. Run:
   git status
   git add .
   git commit -m "Describe your change"
   git push
6. Vercel deploys automatically.

MAIN FILES
----------
index.html                         wedding-only entry page
wedding-reception/index.html      wedding + reception entry page
all/index.html                    wedding + reception + Color Fest
assets/config.js                  event data, RSVP, audio settings
assets/app.js                     website behavior
assets/styles.css                 design and animations
images/                           original full-quality photos
images/optimized/                 generated fast-loading copies
tools/optimize-images.py          image optimizer
google-apps-script/Code.gs        Google Sheet RSVP receiver

V7 DESIGN/BEHAVIOR NOTES
------------------------
- Grand ceremonial opening page
- Existing photo roles preserved from the current website
- Save-the-Dates gets its own photo
- Six-photo collage in "A Little Bit of Us"
- Colorful jewel-tone event cards
- Extra father/mother/grandmother host block removed
- Warm-invitation line simplified
- Scroll-reveal animations + subtle top progress line
- Optimized-first/full-resolution-later image loading
- Configurable audio volume AND configurable audio start offset
- Background/mobile webview audio stopping behavior
- RSVP can save silently to Google Sheets

V7 ADDITIONS
------------
- Bride name corrected everywhere to Sayonti.
- Event wording is exactly "Reception" (no "Reception").
- Reception card changed from teal to royal plum/magenta with antique gold.
- Audio start offset now begins during the invitation-button gesture and re-checks the configured seek point after playback starts.
- Audio loops from the configured musicStartMs point.
- The three newly supplied photos are included under their final filenames.
- Save-the-Date newspaper photo uses a landscape event-section frame.
- pic-5.jpg and pic-6.jpg are treated as portrait photos in the gallery.
- Wide desktop opening page now has ceremonial side arches, lotus/rings/diya motifs, and richer edge decoration.
- A visible wedding-themed scroll rail appears while scrolling; its rings medallion travels down the page.
- Reduced-motion preferences disable the moving scroll ornament.


V8 OPENING + SCROLL ANIMATION
-----------------------------
- The decorative wedding scroll rail appears only AFTER the invitation is opened.
- The scroll rail is on the LEFT side.
- The opening screen uses fuller marigold garlands, a top toran, subtle gold
  drifting particles, slow mandala movement, gentle ceremonial icon glow,
  and a restrained shimmer on the Open Invitation button.
- Reduced-motion device settings disable these animations automatically.

AUDIO FILE
----------
The website now expects exactly:
   assets/wedding_background.mp3

There is no audio-skip setting anymore. If you want the music to begin later
in the original track, trim the MP3 itself and replace wedding_background.mp3.
Keep musicVolume in assets/config.js to control playback volume.
