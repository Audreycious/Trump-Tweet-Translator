
const STORE = {
    trumpBaseUrl: "https://api.whatdoestrumpthink.com/api/v1/quotes/random",
    translateBaseUrl: "https://api.mymemory.translated.net/get",
    yodaBaseUrl: "https://api.funtranslations.com/translate/yoda.json",
    lastTweet: null,
    lastTranslatedTweet1: null,
    lastTranslatedTweet2: null,
    lastTranslatedTweet3: null,
    finalTranslatedTweet: null
};

$(document).ready(function () {
    function createQueryString(options) {
        const queryItems = Object.keys(options)
          .map(option => `${encodeURIComponent(option)}=${encodeURIComponent(options[option])}`)
        return queryItems.join('&');
      }

    // Trump Tweets
    function getTrumpTweets() {
        const trumpUrl = STORE.trumpBaseUrl;

        fetch(trumpUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                // console.log(responseJson);
                STORE.lastTweet = responseJson.message;
                $('#trump-tweet-container').html(responseJson.message);
            })
            .catch(err => {
                $('#trump-tweet-container').text(`Something went wrong: ${err.message}`);
            });
    }

    // Translate tweets
    function translateYoda() {
        const yodaBaseUrl = STORE.yodaBaseUrl;

        let translateLang = $("select option:checked").val();
        // console.log(translateLang);
        translateLang = translateLang.toString();
        
        let options = {
            text: STORE.lastTweet,
        };
        // console.log(options);

        let queryString = createQueryString(options);

        let yodaSendUrl = yodaBaseUrl + "?" + queryString;
        // console.log(queryString);
        // console.log(translateSendUrl);
        fetch(yodaSendUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                STORE.lastTranslatedTweet1 = responseJson.contents.translated;
                // console.log(STORE.lastTranslatedTweet1);
                translateChinese(translateLang);
            })
            .catch(err => {
                $('#translated-tweet-container').text(`Something went wrong: ${err.message}`);
            });
    }

    function translateChinese(translateLang) {
        let translateBaseUrl = STORE.translateBaseUrl;
        let translateTemp = STORE.lastTranslatedTweet1;
        let options = {
            q: translateTemp,
            langpair: "en|zh"
        };

        let queryString = createQueryString(options);

        let translateSendUrl = translateBaseUrl + "?" + queryString;
        // console.log(queryString);
        // console.log(translateSendUrl);
        fetch(translateSendUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                STORE.lastTranslatedTweet2 = responseJson.responseData.translatedText;
                // console.log(STORE.lastTranslatedTweet2);
                translateLanguage(translateLang);
            })
            .catch(err => {
                $('#translated-tweet-container').text(`Something went wrong: ${err.message}`);
            });
    }

    function translateLanguage(translateLang) {
        let translateBaseUrl = STORE.translateBaseUrl;
        let translateTemp = STORE.lastTranslatedTweet2;
        let options = {
            q: translateTemp,
            langpair: "zh|" + translateLang
        };

        let queryString = createQueryString(options);

        let translateSendUrl = translateBaseUrl + "?" + queryString;
        // console.log(queryString);
        // console.log(translateSendUrl);
        fetch(translateSendUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                STORE.lastTranslatedTweet3 = responseJson.responseData.translatedText;
                // console.log(STORE.lastTranslatedTweet2);
                translateEnglish(translateLang);
            })
            .catch(err => {
                $('#translated-tweet-container').text(`Something went wrong: ${err.message}`);
            });
    }

    function translateEnglish(translateLang) {
        let translateBaseUrl = STORE.translateBaseUrl;
        let translateTemp = STORE.lastTranslatedTweet3;
        let options = {
            q: translateTemp,
            langpair: translateLang + "|en"
        };

        let queryString = createQueryString(options);

        let translateSendUrl = translateBaseUrl + "?" + queryString;
        // console.log(queryString);
        // console.log(translateSendUrl);
        fetch(translateSendUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                STORE.finalTranslatedTweet = responseJson.responseData.translatedText;
                // console.log(STORE.finalTranslatedTweet);
                $('#translated-tweet-container').html(STORE.finalTranslatedTweet);
            })
            .catch(err => {
                $('#translated-tweet-container').text(`Something went wrong: ${err.message}`);
            });
    }

    function handleButtonClicks() {
        $('main').on("click", "#start-button", () => {
            $("#home-page").addClass("hidden").fadeOut("slow", () => {

            });
            $("#tweet-page").css("display", "flex").hide().fadeIn("slow", () => {

            });
        })

        $('main').on("click", "#tweet-button", () => {
            getTrumpTweets();
        })

        $('main').on('click', "#translate-button", () => {
            if (STORE.lastTweet != null) {
                $('#translated-tweet-container').html("Loading...");
                translateYoda();
            }
            else {
                $('#translated-tweet-container').html("Get new tweet first!");
            }
        })
    }

    handleButtonClicks();
});