
/* eslint-disable */
(function () {
    window.elvah5 = window.elvah5 || {}

    function extend(o, ch) {
        if (o && ch && typeof ch === 'object') {
            for (var k in ch) {
                ch.hasOwnProperty(k) && (o[k] = ch[k]);
            }
        }
        return o;
    }
    
    elvah5.conf = {
        style: 0, //1：有客服；2：没有客服
        domain: '', //style对应的域名
        appId: '',
        appKey: '',
        appName: '',
        language: ''
    };
    elvah5.isReady = false;
    elvah5.initTid = 0;
    elvah5.init = function (elva_data) {
        extend(elvah5.conf, elva_data);
        var elvaBox = document.createElement("div");
        elvaBox.setAttribute("id", "elvah5Div");
        elvaBox.className = "elvaBox";
        var closeBtn = document.createElement("div");
        closeBtn.className = "close";
        elvaBox.appendChild(closeBtn);
        if (closeBtn.attachEvent) {
            closeBtn.attachEvent('onclick', close);
        } else {
            closeBtn.addEventListener('click', close);
        }
        document.body.appendChild(elvaBox);
        elvah5.isReady = true;
        elvah5.initTid = 0;
        elvah5.show();
    }

    function close() {
        var divD = document.getElementById("elvah5Div");
        if(!divD) return;
        if (divD.style.display == "none") {
        }
        else {
            if(elvah5.initTid > 0){
                clearTimeout(elvah5.initTid);
            }
            elvah5.initTid = 0;
            elvah5.isReady = false;
            divD.style.display = "none";
            document.body.removeChild(divD);
        }
    }

    elvah5.show = function () {
        if(!elvah5.isReady) return;
        var conf = elvah5.conf;
        var url;
        if(conf.style == 1){ //有客服
            url = [conf.domain, 
                '/gameid/', conf.appId, 
                '/gameuid/', conf.userUid, 
                '/gameName/', conf.appName, 
                '/username/', conf.userName,
                '/lan/', conf.language
                // '/sdkVersion/1.4.4',
                // '/hsTags/tag',
            ].join('');
        }
        else if(conf.style == 2){ //无客服 
            var tmp = conf.domain;
            var idx = tmp.indexOf(':');
            if(idx > -1) {
                tmp = conf.domain.substr(idx+3);
            } 
            idx = tmp.indexOf('/');
            if(idx > -1) {
                tmp = tmp.substring(0, idx);
            }
            url = [conf.domain, 
                '/appKey/', conf.appKey, 
                '/domain/', tmp, 
                '/appId/', conf.appId, 
                '/?mode=showConversation',
                '&appName=', conf.appName, 
                '&language=', conf.language,
                '&conversationIntent=2'
                // '&userTags=tag',
                // '&sdkVersion=2.0.0'
            ].join('');
        }
        if(!url) return;

        var ifr = document.getElementById('frmElva') || document.createElement('iframe');
        ifr.setAttribute('src', url);
        ifr.setAttribute("allowtransparency", "true");
        ifr.setAttribute("id", "frmElva");
        ifr.setAttribute("name", "frmElva");
        ifr.style.width = "100%";
        ifr.style.height = "100%";
        ifr.setAttribute("frameborder", "no");
        ifr.setAttribute("border", "0");
        var elvaBox = document.getElementById('elvah5Div');
		if (elvaBox == null) {
			alert('please init elvah5 first');
			return;
		}
        elvaBox.appendChild(ifr);

        if(conf.style == 2) return;

        //特殊处理aihelp首次加载的报错
        var aihelp_init = localStorage.getItem("aihelp_init");
        if(!aihelp_init){
            localStorage.setItem("aihelp_init", "1");
            elvah5.initTid = setTimeout(function(){
                elvaBox.removeChild(ifr);
                if(elvah5.initTid > 0){
                    clearTimeout(elvah5.initTid);
                }
                elvah5.initTid = 0;
                elvah5.show();
            }, 3000);
        }
    }
})();
