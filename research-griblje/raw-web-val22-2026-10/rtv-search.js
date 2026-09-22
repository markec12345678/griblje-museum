let search4dModul = (function($, helper) {
    const EVENT_PLAYLIST_ITEMS = 'EVENT_PLAYLIST_ITEMS';
    const CURRENT_RECORDING_PLAYING = 'CURRENT_RECORDING_PLAYING';
    const NEXT_RECORDING_PLAYING = 'NEXT_RECORDING_PLAYING';

    if(cookieHelper.cookieExist('APISESSION') === false){
        //console.log('E_SESSION_NONE');
    }
    
    let dev = '';
    if(window._globalIsDev === '1') {
        dev = 'dev.'
    } 

       
    let API_CLIENT_ID = '82013fb3a531d5414f478747c1aca622'
    let endpoint = "https://api." + dev + "rtvslo.si/ava/getSearch2?client_id=" + API_CLIENT_ID; 
    let endpoint_purchased = "https://api." + dev + "rtvslo.si/ava/purchased?client_id=" + API_CLIENT_ID; 
    let endpoint_chiltren = "https://api." + dev + "rtvslo.si/ava/getChildren/"; 
    let endpoint_history = "https://api." + dev + "rtvslo.si/ava/history?client_id="  + API_CLIENT_ID;
    let endpoint_playlistrecordings = "https://api." + dev + "rtvslo.si/ava/playlistrecordings?client_id="  + API_CLIENT_ID + "&listId={playlist_id}&pageSize=100&pageNumber=0";
    // "Sorodno" - recommender shelf, served by mmc-api Pipes::getRelated() with group=recommender
    let endpoint_related_recommender = "https://api." + dev + "rtvslo.si/pipes/related?client_id=ec0659b521575fec3fa0bbc3bb060e4d&group=recommender&clip=clip&pageNumber=0&pageSize={pageSize}&recording_id={recId}";
  
    const pageSize = 50;

    function _urlFormater(params) {
        //console.log("🚀 ~ file: search.js ~ line 9 ~ _urlFormater ~ params", params)
        var retVal = [];
        if(params && params.s){
            var tmp = "source=";
            if(params.s == "tv") {
                tmp = tmp + "slo1,slo2,slo3,tvmb,tvkp,mmctv";
            }
            else if(params.s == "ra") {
                tmp = tmp + "ra1,val202,ars,ramb,rakp,capo,mmr";
            }
            else {
                tmp = tmp + params.s;
            }
            retVal.push(tmp)
        }
        if(params && params.q){
            var tmp = "q=" + params.q;
            retVal.push(tmp)
        }

        if(params && params.c){
            var tmp = "clip=" + params.c;
            retVal.push(tmp);
        }   


        if(params && params.p){
            var tmp = "pageNumber=" + params.p;
            retVal.push(tmp)
        }

        if(params && params.h){
            params['t'] = params.h;
            
            let tmp = "sort=popularity&from=";
            let to = new Date().toISOString().slice(0, 10);
            let from = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0, 10);
            if(params.h === 'd') {
                tmp = tmp + from + '&to=' + to;
                retVal.push(tmp)
            }
            else {
                tmp = "sort=popularity";
                if(params.h == 'w') {
                    tmp = tmp + '&popularity_period=week'; 
                }
                if(params.h === 'm') {
                    tmp = tmp + '&popularity_period=month';
                }
                if(params.h === 'y') {
                    tmp = tmp + '&popularity_period=year';
                }
                retVal.push(tmp)
            }           
        }

        if(params && params.z){
            var tmp = "showTypeId=" + params.z;
            retVal.push(tmp)
        }

        if(params && params.l){
            if(params.l !== 'VSI'){
                var tmp = "language=" + params.l;
                retVal.push(tmp)
            }
           
        }
        else {
            var tmp = "language=SLO";
            retVal.push(tmp)
        }

        if(params && params.d){
            if(params.d == '1') {
                var tmp = "subtitled=1";
                retVal.push(tmp)
            }
            if(params.d == '2') {
                var tmp = "signLanguage=1";
                retVal.push(tmp)
            }
            if(params.d == '3') {
                var tmp = "audioDescription=1";
                retVal.push(tmp)
            }
            if(params.d == '4') {
                var tmp = "audioTranslation=1";
                retVal.push(tmp)
            }
            
        }

        var tmp = "promo=0";
        retVal.push(tmp)

        /*
        if(params && params.t) {
            var tmp = "from=";
            let to = new Date().toISOString().slice(0, 10);
            let from = new Date(new Date().setDate(new Date().getDate()-1));
            if(params.t === 'w') {
                from = new Date(new Date().setDate(new Date().getDate()-7));
            }
            if(params.t === 'm') {
                from = new Date(new Date().setDate(new Date().getDate()-30));
            }
            if(params.t === 'y') {
                from = new Date(new Date().setDate(new Date().getDate()-365));
            }
            from = from.toISOString().slice(0, 10)
            tmp = tmp + from + '&to=' + to;
            retVal.push(tmp)
        }*/

        if(params && params.r) {
            let date = params.r.split(' ');
            if(date.length > 1){
                let from = date[0].replace(/^\s+|\s+$/gm,'');
                let to = date[1].replace(/^\s+|\s+$/gm,'');
                let tmp = "from=" + from + '&to=' + to + '&order=asc';     
                retVal.push(tmp)  
            }         
        }

        return retVal.join('&');
    }
  
    function _getData(params, clb) {
     
        
        var params = _urlFormater(params) ;   
        let url = endpoint + "&promo=0&prepare=medium&pageSize=" + pageSize + "&" + params;
        if(url.indexOf('from=') == -1) {
            url = url + '&from=2003-01-01';
        }

        if(url.indexOf('sort=') == -1) {
            url = url + '&sort=date';
        }
      
        
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (resp) {
                if (resp && resp.response && resp.response.recordings) {         
                   
                    if(clb){                
                        clb(resp.response.recordings);                
                    }                   
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    function _getHistory(params, clb) {
     
        
        var params = _urlFormater(params) ;   
        let url = endpoint_history + "&pageSize=" + pageSize + "&" + params;
        
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (resp) {
                if (resp && resp.response && resp.response.recordings) {                     
                    if(clb){                
                        clb(resp.response.recordings);                
                    }                   
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    function _getPlaylistRecordings(id, clb) {
     
        let url = endpoint_playlistrecordings.replace('{playlist_id}', id);
        
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (resp) {
                if (resp && resp.response && resp.response.recordings && clb) {                     
                             
                    

                    resp.response.recordings.map(function(itm, i){
                        let tmp = ['/seznam', id, i];
                        resp.response.recordings[i].canonical.path = itm.canonical.path + tmp.join('/');
                    })

                    helper.dEvent(EVENT_PLAYLIST_ITEMS, resp.response);
                    //console.log('resp.response.recordings', resp.response);
                    clb(resp.response);                
                                     
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

 
    function _getChildren(id, current_id, pageNumber, clb) {
        var url = endpoint_chiltren + id + "?&client_id=" + API_CLIENT_ID + "&sort=date&order=desc&pageSize=" + pageSize + "&pageNumber=" + pageNumber;
        
        
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (data) {
                if (data && data.response && data.response.recordings) {
                    var filter = data.response.recordings.filter(function(itm) {
                        return itm.id != current_id;
                    })
                   
                    filter.map(function(recording, i){
                        if(i > 2){
                            filter[i]['hide'] = '1';
                        }
                    }) 

                    if(clb){                
                        clb(filter);                
                    }              
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    function _getRelatedClips(showId, current_id, pageNumber, clb) {
        var url = endpoint + "&showId=" + showId + "&promo=0&sort=date&order=desc&pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&clip=clip&from=2013-01-01&language=SLO";
        
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (data) {
                if (data && data.response && data.response.recordings) {

                    var filter = data.response.recordings.filter(function(itm) {
                        return itm.id != current_id;
                    })
                    
                    if(Array.isArray(filter)) {
                        filter = data.response.recordings.filter(function(itm) {
                            return filter.indexOf(itm.id) === -1;
                        })
                    }
                   
                    if(clb){                
                        clb(filter);                
                    }                  
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });

    }

    // pipes entry -> only the fields render.renderRecordings() reads for the aside list
    function _pipesEntryToRecording(entry) {
        if (!entry || !entry.media_meta) {
            return null;
        }

        var meta = entry.media_meta;
        var images = (entry.media_group || []).find(function (group) { return group.type === 'image'; });
        var thumbnail = images ? (images.media_item || []).find(function (item) { return item.key === 'thumbnail'; }) : null;

        // canonical_link_share is absolute and always points at prod, keep only the path
        // so links stay inside the environment the player is running in
        var link = (meta.canonical_link_share || '').replace(/^https?:\/\/[^\/]+/, '');
        var date = (entry.published || '').split('T')[0].split('-');

        return {
            id: meta.recordingId,
            title: entry.title,
            thumbnail_sec: thumbnail ? thumbnail.src : '',
            date_slo: date.length === 3 ? parseInt(date[2], 10) + '. ' + parseInt(date[1], 10) + '. ' + date[0] : '',
            canonical: { path: link },
            stub: link.split('/').slice(-2)[0] || '',
            source: meta.source,
            mediaType: entry.type ? entry.type.value : 'video'
        };
    }

    // "Sorodno" - recommender based related recordings (dev only until verified on prod)
    function _getRelatedRecommender(recordingId, current_id, pageSize, clb) {
        var url = endpoint_related_recommender
            .replace('{recId}', recordingId)
            .replace('{pageSize}', pageSize || 20);

        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (data) {
                var entries = (data && data.response && data.response.entry) ? data.response.entry : [];
                if (clb) {
                    clb(entries.map(_pipesEntryToRecording).filter(function (itm) {
                        return itm !== null && itm.id != current_id;
                    }));
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    function _getLastShows(showId, current_id, pageNumber, clb) {                  
        var promo = 0;
        if(showId == 173250644){
            promo = 1;
        }
        var url = endpoint + "&showId=" + showId + "&promo=" + promo + "&sort=date&order=desc&pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&clip=show&from=2013-01-01";   
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (data) {
                if (data && data.response && data.response.recordings) {

                    /*let filter = data.response.recordings.filter(function(itm) {
                        return itm.id != current_id;
                    })*/

                    data.response.recordings.map(function(itm, index) {

                        if(itm.id == current_id) {
                            helper.dEvent(CURRENT_RECORDING_PLAYING, itm);
                            try {
                                let next = data.response.recordings[index + 1];
                                //console.log('next',next)
                                helper.dEvent(NEXT_RECORDING_PLAYING, next);
                            } 
                            catch(e){console.log('e',e)}         
                            data.response.recordings[index]['current_playing'] = '1';                     
                        }
                    })
    
                    if(clb){                
                        clb(data.response.recordings);                
                    }                  
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    function _getPurchased(showId, status, clb) {                  
     
        
        var url = endpoint_purchased + "&showId=" + showId + "&status=" + status;   
        $.ajaxSetup({xhrFields: { withCredentials: true } });
        $.ajax(url, {
            success: function (data) {
                if (data && data.response && data.response.recordings) {

    
                    if(clb){                
                        clb(data.response.recordings);                
                    }                  
                }
            },
            error: function (e) {
                console.log('e', e);
            }
        });
    }

    return {
        urlFormater: _urlFormater,
        getData: _getData,
        getLastShows: _getLastShows,
        getPurchased: _getPurchased,
        getRelatedClips: _getRelatedClips,
        getRelatedRecommender: _getRelatedRecommender,
        getChildren: _getChildren,
        getHistory: _getHistory,
        getPlaylistRecordings: _getPlaylistRecordings
    }
   
     
})(jQuery, helpers4dModul);

