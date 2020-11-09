initCookies();

//Check cookie consent and act on check
function initCookies() {
    // If we decide we need to re-notify we can increment the number here.
    var latestConsentValue = "1";
    var actualConsentValue = document.cookie.replace(/(?:(?:^|.*;\s*)MBCC\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (actualConsentValue !== latestConsentValue) {
        var notice = $(".cookies");
        notice.show();
        document.body.addEventListener("mouseup", function() {
            notice.hide();
            $(".iframeOverlay").hide();
        }), { capture: true, once: true , passive: true };

        element = document.querySelector('.iframeOverlay');
        element.addEventListener('click', function(){
            notice.hide();
            $(".iframeOverlay").hide();
        }), { capture: true, once: true , passive: true };

        document.cookie = "MBCC=" + latestConsentValue + "; path=/; expires=Tue, 19 Jan 2038 00:00:00 GMT";
    }else{
        $(".iframeOverlay").hide();
    }
  }
  