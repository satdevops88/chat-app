(function() {

        window.Meeting = function(__socket) {
            var signaler;
            var self = this;

            var _socket = __socket
            
            var join_room_id;

            this.setSocket = function(socket){
                self._socket = socket;
            }

            this.onmeeting = function(room) {
                if (self.detectedRoom) return;
                self.detectedRoom = true;
                self.meet(room);
            };
            function initSignaler(room_id) {
                
                self.join_room_id = room_id;
                signaler = new Signaler(self);
            }
            function captureUserMedia(callback) {
                var constraints = {
                    audio: {sampleSize : 32, channelCount : 2},
                    video: true
                };
    
                navigator.getUserMedia(constraints, onstream, onerror);
    
                function onstream(stream) {
                    self.stream = stream;
                    console.log(stream);
                    
                    callback(stream);
    
                    var video = document.createElement('video');
                    video.id = 'self';
                    video.style.width = '40%';
                    video.style.right = '10px';
                    video.style.bottom = '10px';
                    video.style.position = 'relative';
                    video.style.borderRadius = '7px';
                    video.style.float = 'right';
                    video[isFirefox ? 'mozSrcObject' : 'srcObject'] = isFirefox ? stream : stream;
                    
                    video.play();
    
                    self.onaddstream({
                        video: video,
                        stream: stream,
                        userid: 'self',
                        type: 'local'
                    });
                }
    
                function onerror(e) {
                    console.error(e);
                }
            }
            this.setup = function(roomid) {
                captureUserMedia(function() {
                    !signaler && initSignaler();
                    signaler.broadcast({
                        roomid: roomid
                    });
                    /*var data = {
                        roomid : roomid,
                        broadcasting : true
                    }
                    sendMessage(data);*/
                });
            };
            this.meet = function(room) {
                captureUserMedia(function() {
                    !signaler && initSignaler();
                    
                    
                    signaler.join({
                        to: room.userid,
                        roomid: room.roomid
                    });
                });
            };
            this.check = function(room){
                initSignaler(room);
            };

            
        };
        var IceServersHandler = (function() {
                function getIceServers(connection) {
                    var iceServers = [];
        
                    iceServers.push(getSTUNObj('stun:stun.l.google.com:19302'));
        
                    /*iceServers.push(getTURNObj('stun:webrtcweb.com:7788', 'muazkh', 'muazkh')); // coTURN
                    iceServers.push(getTURNObj('turn:webrtcweb.com:7788', 'muazkh', 'muazkh')); // coTURN
                    iceServers.push(getTURNObj('turn:webrtcweb.com:8877', 'muazkh', 'muazkh')); // coTURN
        
                    iceServers.push(getTURNObj('turns:webrtcweb.com:7788', 'muazkh', 'muazkh')); // coTURN
                    iceServers.push(getTURNObj('turns:webrtcweb.com:8877', 'muazkh', 'muazkh')); // coTURN
        
                    // iceServers.push(getTURNObj('turn:webrtcweb.com:3344', 'muazkh', 'muazkh')); // resiprocate
                    // iceServers.push(getTURNObj('turn:webrtcweb.com:4433', 'muazkh', 'muazkh')); // resiprocate
        
                    // check if restund is still active: http://webrtcweb.com:4050/
                    iceServers.push(getTURNObj('stun:webrtcweb.com:4455', 'muazkh', 'muazkh')); // restund
                    iceServers.push(getTURNObj('turn:webrtcweb.com:4455', 'muazkh', 'muazkh')); // restund
                    iceServers.push(getTURNObj('turn:webrtcweb.com:5544?transport=tcp', 'muazkh', 'muazkh')); // restund*/
        
                    return iceServers;
                }
        
                function getSTUNObj(stunStr) {
                    var urlsParam = 'urls';
                    if (typeof isPluginRTC !== 'undefined') {
                        urlsParam = 'url';
                    }
        
                    var obj = {};
                    obj[urlsParam] = stunStr;
                    return obj;
                }
        
                function getTURNObj(turnStr, username, credential) {
                    var urlsParam = 'urls';
                    if (typeof isPluginRTC !== 'undefined') {
                        urlsParam = 'url';
                    }
        
                    var obj = {
                        username: username,
                        credential: credential
                    };
                    obj[urlsParam] = turnStr;
                    return obj;
                }
        
                return {
                    getIceServers: getIceServers
                };
            })();
        
        var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
        var RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;
    
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
    
        var isFirefox = !!navigator.mozGetUserMedia;
        var isChrome = !!navigator.webkitGetUserMedia;
    
        var iceServers = {
            iceServers: IceServersHandler.getIceServers()
        };
    
        var optionalArgument = {
            optional: [{
                DtlsSrtpKeyAgreement: true
            }]
        };
    
        var offerAnswerConstraints = {
            optional: [],
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            }
        };
        
        
        
        
        function getToken() {
            return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
        }
    	function onSdpSuccess() {}

        function onSdpError(e) {
            console.error('sdp error:', e.name, e.message);
        }   
       function Signaler(root) {
            var userid = getToken();
            console.log('userid = ' + userid);
            var signaler = this;
            var peers = { };
            var candidates = { };
            console.log(root);
            this.signal = function(data) {
                data.userid = userid;
                if(data.broadcasting)
                {
                    setInterval(() => {
                        root._socket.emit("message", JSON.stringify(data));

                    }, 4000);
                }
                else
                {
                    root._socket.emit("message", JSON.stringify(data));
                }
                
            };
            root.openSignalingChannel(function(message) {
                
                message = JSON.parse(message);
                
                console.log(message);
                if (message.userid != userid) {
                    signaler.onmessage(message);
                }
            });
            this.onmessage = function(message) {
                // if new room detected
                if (message.roomid && message.broadcasting && !signaler.sentParticipationRequest)
                {
                    if(message.roomid == root.join_room_id)
                    {
                        root.onmeeting(message);    
                    }
                    else
                    {
                    }
                    
                }
                
                if (message.sdp && message.to == userid){
                    
                    //alert(userid);
                    this.onsdp(message);
                }

                // if someone shared ICE
                if (message.candidate && message.to == userid)
                    this.onice(message);
                
                if (message.participationRequest && message.to == userid) {
                    
                    var _options = options;
                    _options.to = message.userid;
                    _options.stream = root.stream;
                    
                    console.log('_options = ');
                    console.log(_options);
                    
                    //alert('---- CREATE OFFER');
                    peers[message.userid] = Offer.createOffer(_options);
                    
                }
                    
            };
            this.onsdp = function(message) {
                var sdp = message.sdp;
    
                if (sdp.type == 'offer') {
                    var _options = options;
                    _options.stream = root.stream;
                    _options.sdp = sdp;
                    _options.to = message.userid;
                    peers[message.userid] = Answer.createAnswer(_options);
                }
    
                if (sdp.type == 'answer') {
                    peers[message.userid].setRemoteDescription(sdp);
                }
            };
    
            // if someone shared ICE
            this.onice = function(message) {
                var peer = peers[message.userid];
                if (!peer) {
                    var candidate = candidates[message.userid];
                    if (candidate) candidates[message.userid][candidate.length] = message.candidate;
                    else candidates[message.userid] = [message.candidate];
                } else {
                    peer.addIceCandidate(message.candidate);
    
                    var _candidates = candidates[message.userid] || [];
                    if (_candidates.length) {
                        for (var i = 0; i < _candidates.length; i++) {
                            peer.addIceCandidate(_candidates[i]);
                        }
                        candidates[message.userid] = [];
                    }
                }
            };
            var options = {
                onsdp: function(sdp, to) {
                    //alert('onsdp');
                    signaler.signal({
                        sdp: sdp,
                        to: to
                    });
                },
                onicecandidate: function(candidate, to) {
                    //alert('onicecandidate');
                    signaler.signal({
                        candidate: candidate,
                        to: to
                    });
                },
                onaddstream: function(stream, _userid) {
                    console.debug('onaddstream', '>>>>>>', stream);
    
                    var video = document.createElement('video');
                    video.id = _userid;
                    video[isFirefox ? 'mozSrcObject' : 'srcObject'] = isFirefox ? stream : stream;
                    video.autoplay = true;
                    video.style.width = '100%';
                    video.style.height = '600px';
                    video.play();
    
                    function onRemoteStreamStartsFlowing() {
                        if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                            afterRemoteStreamStartedFlowing();
                        } else
                            setTimeout(onRemoteStreamStartsFlowing, 300);
                    }
    
                    function afterRemoteStreamStartedFlowing() {
                        if (!root.onaddstream) return;
                        root.onaddstream({
                            video: video,
                            stream: stream,
                            userid: _userid,
                            type: 'remote'
                        });
                    }
    
                    onRemoteStreamStartsFlowing();
                }
            };
            
            // call only for session initiator
            this.broadcast = function(_config) {
                signaler.roomid = _config.roomid || getToken();
                signaler.isbroadcaster = true;
                signaler.signal({
                    roomid: signaler.roomid,
                    broadcasting: true
                });
                
            };
            
            this.join = function(_config) {
                signaler.roomid = _config.roomid;
                this.signal({
                    participationRequest: true,
                    to: _config.to
                });
                signaler.sentParticipationRequest = true;
            };
            
           
       }
        var Offer = {
            createOffer: function(config) {
                var peer = new RTCPeerConnection(iceServers, optionalArgument);
        
                if (config.stream) peer.addStream(config.stream);
                if (config.onaddstream)
                    peer.onaddstream = function(event) {
                        config.onaddstream(event.stream, config.to);
                    };
                if (config.onicecandidate)
                    peer.onicecandidate = function(event) {
                        if (event.candidate) config.onicecandidate(event.candidate, config.to);
                    };
        
                peer.createOffer(function(sdp) {
                    peer.setLocalDescription(sdp);
                    //alert('createoffer');
                    if (config.onsdp) config.onsdp(sdp, config.to);
                }, onSdpError, offerAnswerConstraints);
        
                this.peer = peer;
        
                return this;
            },
            setRemoteDescription: function(sdp) {
                this.peer.setRemoteDescription(new RTCSessionDescription(sdp), onSdpSuccess, onSdpError);
            },
            addIceCandidate: function(candidate) {
                this.peer.addIceCandidate(new RTCIceCandidate({
                    sdpMLineIndex: candidate.sdpMLineIndex,
                    candidate: candidate.candidate
                }));
            }
        };
        
        
        var Answer = {
            createAnswer: function(config) {
                var peer = new RTCPeerConnection(iceServers, optionalArgument);
    
                if (config.stream) peer.addStream(config.stream);
                if (config.onaddstream)
                    peer.onaddstream = function(event) {
                        config.onaddstream(event.stream, config.to);
                    };
                if (config.onicecandidate)
                    peer.onicecandidate = function(event) {
                        if (event.candidate) config.onicecandidate(event.candidate, config.to);
                    };
    
                peer.setRemoteDescription(new RTCSessionDescription(config.sdp), onSdpSuccess, onSdpError);
                peer.createAnswer(function(sdp) {
                    peer.setLocalDescription(sdp);
                    if (config.onsdp) config.onsdp(sdp, config.to);
                }, onSdpError, offerAnswerConstraints);
    
                this.peer = peer;
    
                return this;
            },
            addIceCandidate: function(candidate) {
                this.peer.addIceCandidate(new RTCIceCandidate({
                    sdpMLineIndex: candidate.sdpMLineIndex,
                    candidate: candidate.candidate
                }));
            }
        };
        
})();

var meeting = new Meeting();

export { meeting };