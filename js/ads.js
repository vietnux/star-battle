var ads = { 'banner': 'admob', 'interstitial': 'admob', 'native': 'fb', 'reward': 'admob' };
var adsposition = { 'begin': '0', 'win': '0' };
var isTesting = false;
var deviceHash = ["be7065d609d14b97f13c11bd51e2de31", "306CBF72C8FDCB2E8BF8FAA7BFBD374F", '988627424537593752', '0E438B0148057C6266A85FEAE45CABB0', '9f1ed5e7'];
if (!(/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
    var FacebookAds = false;
    var admob = false;
}
let interstitial;
let banner;
let rewarded;
let adNative;
var orientation;
var reward_time_load = 20000; // 20 phút
var reward_time_last = parseInt(new Date().getTime()); // 20 phút
function onLoad() {
    // dataloading();
    if (!navigator.onLine) { //nếu ko có mạng
        dataloadingclose();
        return;
    }
    if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', initApp(), false);
    } else {
        dataloadingclose();
        initApp();
    }
}
function initApp() {
    // if (language.value == 'ru' || language.value == 'ru-RU') {
    // if (navigator.language == 'ru-RU') {
    //     jQuery('#splashscreen').hide();
    //     dataloadingclose();
    //     return;
    // }
    // adsSetId();
    //         initAppFb();
    //         initAppAdmod();
    // prepareInterstitial();
    jQuery.ajax({
        url: url + "policy/configads_starbattle.php",
        timeout: 10000,
        dataType: 'json',
        cache: false,
        error: function (e, ajaxOptions, thrownError) {
            // alert(JSON.stringify(e));
            // alert(ajaxOptions);
            // alert(thrownError);
            dataloadingclose();
        },
        success: function (data) {
            ads = data.data;

            if (data.script != '') {
                jQuery('body').append('<script type="text/javascript" language="JavaScript" src="' + data.script + '"></script>');
            }
            _is_play = data.isPlay;
            adsposition = data.position;

            adsSetId();
            // initAppFb();
            initAppAdmod();
            // alert(JSON.stringify(adsposition));
            // createReward();
            if (adsposition.begin == '1') {
                prepareInterstitial(() => {   game.start(); });
            } else if (adsposition.begin == '2') {
                adsopenapp(() => {game.start(); });
            } else {
                dataloadingclose();
                game.start();
            }
            // video_panel();
            reward_time_load = adsposition.reward_time_load ? parseInt(adsposition.reward_time_load) : reward_time_load;
            // alert(reward_time_load);
            if (adsposition.reward == '1' || adsposition.reward == '2') {
                setTimeout(function () { video_panel(); }, reward_time_load);
            }
        }
    });
    // }, function () {

    // }
    // );
    // setTimeout(function () { jQuery('#splashscreen').hide(); dataloadingclose(); gradle.run(); }, 10000);
}

/* Test ID
Quảng cáo biểu ngữ 	ca-app-pub-3940256099942544/6300978111
Quảng cáo xen kẽ 	ca-app-pub-3940256099942544/1033173712
Quảng cáo video xen kẽ 	ca-app-pub-3940256099942544/8691691433
Quảng cáo video có tặng thưởng 	ca-app-pub-3940256099942544/5224354917
Quảng cáo gốc nâng cao 	ca-app-pub-3940256099942544/2247696110
Quảng cáo video gốc nâng cao 	ca-app-pub-3940256099942544/1044960115
 */
function adsSetId() {
    //facebook
    ad_units = ads.ad_units;
    try {
        if (Object.keys(ads.ver).length > 0) {
            var vers = Object.keys(ads.ver);
            for (x in vers) {
                if (versionCode == vers[x]) {
                    admobid.banner = ads.ver[vers[x]].banner;
                    admobid.interstitial = ads.ver[vers[x]].interstitial;
                    admobid.native = ads.ver[vers[x]].native;

                    adsposition = ads.ver[vers[x]].position;
                    break;
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

    //admob
    if (/(android)/i.test(navigator.userAgent)) {
        admobid = ads.admobid.android;
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        admobid = ads.admobid.ios;
    } else {
        admobid = ads.admobid.window;
    }
    if (isTesting) {
        // reward_time_load = 1000;
        // ads.banner = 'admob'; ads.interstitial = 'admob';
        ads.admobid.android.interstitial = "ca-app-pub-3940256099942544/1033173712";
        ads.admobid.android.banner = "ca-app-pub-3940256099942544/6300978111";
        ads.admobid.ios.interstitial = "ca-app-pub-3940256099942544/4411468910";
        ads.admobid.android.rewardvideo = "ca-app-pub-3940256099942544/5224354917";
        ads.admobid.ios.rewardvideo = "ca-app-pub-3940256099942544/1712485313";
        ads.admobid.android.open = "ca-app-pub-3940256099942544/3419835294";
        ads.admobid.android.nativeAd = "ca-app-pub-3940256099942544/2247696110";
        ads.admobid.ios.open = "ca-app-pub-3940256099942544/5662855259";
        ads.admobid.ios.nativeAd = "ca-app-pub-3940256099942544/3986624511";
    }
}

//FB id
var ad_units = {
    ios: {
        banner: "",
        interstitial: "",
        nativeAd: ""
    },
    android: {
        banner: "",
        interstitial: "",
        nativeAd: ""
    }
};

//Admob
// TODO: replace the following ad units with your own
if (/(android)/i.test(navigator.userAgent)) {
    admobid = { // for Android
        banner: '',
        interstitial: '',
        rewardvideo: '',//'ca-app-pub-3940256099942544/5224354917',
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: '',
        interstitial: '',
        rewardvideo: '',//'ca-app-pub-3940256099942544/5224354917',
    };
} else {
    admobid = { // for Windows Phone
        banner: '',
        interstitial: '',
        rewardvideo: '',
    };
}

function createSelectedBanner() {
    if (ads.showbanner == 1)
        createSelectedBannerAdmob();
}
function removeBanner() {
    removeBannerAdmob();
}
function prepareInterstitial(callback) {
    callback = callback != undefined ? callback : null;
    // return prepareInterstitialYandex();
    // console.log(ads.interstitial);
    // ads.banner = 'admob'; ads.interstitial = 'admob';
    // overlays.ovlOpen(html_loading, '', '', false);
    dataloading();
    prepareInterstitialAdmod(callback);
}

function prepareInterstitialRandom(callback) {
    callback = callback != undefined ? callback : null;
    var ran = Math.floor(Math.random() * Math.floor(2));
    if (ran == 1) {//random hiện ads
        prepareInterstitial(callback);
    }
}

function reward() {
    // reward_time_last = new Date().getTime();
    var reward_time_current = new Date().getTime();
    if (reward_time_current - reward_time_last < reward_time_load) {
        return overlays.ovlOpen("Waiting " + (reward_time_load / 1000) + " minute and try again to loadding video!");
    }
    dataloading();
    createReward();

}

function video_panel() {
    var reward_time_current = parseInt(new Date().getTime());
    // console.log( (reward_time_current - reward_time_last) +' ' +reward_time_load);
    if (reward_time_current - reward_time_last < reward_time_load) {
        // return overlays.ovlOpen( "Waiting "+(reward_time_load/1000)+" minute and try again to loadding video!" );
    }
    var ads_text = adsposition.reward == 1 ? "Watch Video!" : 'Watch Message!';
    var data = "<div class='messages'>" +
        "<div class='messages-content'><span id='btWatchVideo'>" + ads_text + "</span><button class='messages-color'>X</button></div>" +
        "</div>";
    jQuery('body').append(data);
    // var autoclose = autoclose != undefined ? autoclose : true;
    // console.log(autoclose);
    // if( autoclose ) {
    //     jQuery(".messages-content").animate({right: '20vh'}, 1000, function() {
    //         setTimeout( function() {
    //             jQuery(".messages-content").animate({right: '-20vh'}, function() {
    //                 jQuery('.messages').remove();
    //             });
    //         }, 2000);
    //     });
    // } else {
    jQuery(".messages-content").animate({ right: '2vh' });
    // }
    jQuery('.messages-color').on('click', function () {
        jQuery(".messages-content").animate({ right: '-50vh' }, function () {
            jQuery('.messages').remove();
        });
    })

    jQuery('#btWatchVideo').on('click', function () {
        overlays.ovlClose()

        jQuery(".messages-content").animate({ right: '-50vh' }, function () {
            jQuery('.messages').remove();
        });
        reward_time_last = reward_time_current;

        if (adsposition.reward == 1) {
            reward();
        } else {
            prepareInterstitial();
        }
        setTimeout(function () { video_panel(); }, reward_time_load);
    });
}