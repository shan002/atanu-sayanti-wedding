MOBILE CALENDAR FIX

Replace:
  assets/app.js

Add this folder to your project root:
  calendar/
    wedding.ics
    reception.ics

The Add to Calendar buttons now link to real .ics files instead of creating
temporary Blob downloads in JavaScript. This is more reliable on iPhone/Safari
and in mobile browsers.

Test locally:
  py -m http.server 8000

Then open:
  http://localhost:8000/all/

You can directly test the files too:
  http://localhost:8000/calendar/wedding.ics
  http://localhost:8000/calendar/reception.ics

After testing:
  git add .
  git commit -m "Fix mobile calendar links"
  git push
