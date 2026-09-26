# Project screenshots

Drop screenshots here using the paths already referenced in `lib/data.ts`,
for example:

    public/projects/coworking-hub-1.png
    public/projects/coworking-hub-2.png
    public/projects/coworking-hub-3.png

Each project in `lib/data.ts` has an `images: [...]` array — the filename
in that array (minus the leading `/`) is exactly the path Next.js expects
under `public/`.

Recommended size: ~1200x750 (16:10), PNG or JPG, under ~400KB each so the
card carousel stays snappy.

Until real files exist here, every card and the case-study modal fall back
automatically to a gradient placeholder with the project's tech badges —
nothing breaks, nothing needs to be toggled. Just add files with the
matching names and they'll start showing up in the carousel immediately.
