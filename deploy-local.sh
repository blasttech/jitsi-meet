mkdir -p public/css && \
cp -r *.js *.html resources/*.txt connection_optimization favicon.ico fonts images libs static sounds LICENSE lang public && \
cp css/all.css public/css
echo -n `git describe --always` > public/version.html

rm -rf libs
rm -rf build
