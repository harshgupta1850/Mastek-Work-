pinterest

href="https://pinterest.com/pin/create/button/?
url=https://www.brighton.com/product/necklaces/36956-230872/meridian-meridian-equinox-heart-necklace.html
&media=https://www.brighton.com/photos/product/standard/369560S230893/necklaces/meridian-equinox-heart-necklace.jpg
&description=Minimalistic in design, this brushed silver heart pendant is topped..."

href="https://pinterest.com/pin/create/button/?
url=https://www.brighton.com/product/flats/36956-213860/infinity-sparkle-mishel-loafers.html
&media=https://www.brighton.com/photos/product/standard/369560S213932/flats/mishel-loafers.jpg
&description=In high gloss Italian leather, these loafers are as stylish as they..."


twitter
href="https://twitter.com/intent/tweet?
text=In high gloss Italian leather, these loafers are as stylish as they...
&media=https://www.brighton.com/photos/product/standard/369560S213932/flats/mishel-loafers.jpg
&description=In high gloss Italian leather, these loafers are as stylish as they..."


href="https://twitter.com/intent/tweet?
text=With black enamel and rose gold-plate mixed in, our Neptune's Rings...
&media=https://www.brighton.com/photos/product/standard/369560S238246/rings/neptunes-rings-black-trio-ring.jpg
&description=With black enamel and rose gold-plate mixed in, our Neptune's Rings..."







href="https://twitter.com/intent/tweet?
text=The hottest silhouette kicks it up a notch, adding height and a tou...
&media=https://www.brighton.com/photos/product/standard/369560S217662/heels/tap-sandals.jpg
&description=The hottest silhouette kicks it up a notch, adding height and a tou..."



href="https://twitter.com/intent/tweet?
text=These ballerina style shoes are on pointe! So comfortable, and darl...
&media=https://www.brighton.com/photos/product/standard/369560S234139/flats/aleta-ballerinas.jpg
&description=These ballerina style shoes are on pointe! So comfortable, and darl..."


var url='https://pinterest.com/pin/create/button/?url=' + window.location.href + '&description=' + widget.product().description().substring(0,67)+ '...'

The hottest silhouette kicks it up a notch	 adding height and a touch of textural play with flat nailheads.






Officail

href="https://www.facebook.com/sharer/sharer.php?
u=https://www.brighton.com/product/heels/36956-208738/pretty-tough-tap-sandals.html"

href="https://twitter.com/intent/tweet?
text=The hottest silhouette kicks it up a notch, adding height and a tou...
&media=https://www.brighton.com/photos/product/standard/369560S217662/heels/tap-sandals.jpg
&description=The hottest silhouette kicks it up a notch, adding height and a tou..."


href="https://pinterest.com/pin/create/button/?
url=https://www.brighton.com/product/heels/36956-208738/pretty-tough-tap-sandals.html
&media=https://www.brighton.com/photos/product/standard/369560S217662/heels/tap-sandals.jpg
&description=The hottest silhouette kicks it up a notch, adding height and a tou..."

function onShare(social, event) {
    var widget=this;
    var brgtnURL=window.location.href
    var media=widget.product().childSKUs()[0].br_pic1()
    var description=widget.product().description().substring(0,67)+ '...'
    if (event.type === 'click') {
        if (social === "facebook") {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + window.location.href)
        }
        else if (social === "twitter") {
            window.open("https://twitter.com/intent/tweet?text=" + description + '&media=' + media +'&dscription=' + description)
        }
        else if (social === "pinterest") {
            window.open("https://pinterest.com/pin/create/button/?url=" + brgtnURL + '&media=' + media +'&description=' + description)
        }
    }

}
// Social Icons function || starts
            socialIconFB: function(event) {
                console.log('clicked', event);
                var url;
                url="https://www.facebook.com/sharer/sharer.php?u=" + window.location.href
                if (event.type === 'click') {
                   window.open(url)
                }
            },
            socialIconTW: function(event) {
                var widget=this;
                console.log('clicked', event);
                if (event.type === 'click') {
                    console.log(widget.product().description())
                    console.log(widget.product().childSKUs()[0].br_pic1())
                }
                
            },