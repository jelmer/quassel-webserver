/*
// Internal
er.on('_init', function(next, data) {
    console.log('_init');
    networks = data;
    reviver.reviveAll(networks);
    next();
});

// Internal
er.on('network._init', function(next, networkId, data) {
    console.log('network._init');
    reviver.reviveAll(data);
    networks.set(networkId, data);
    next();
}).after('_init');

er.on('network.init', function(next, networkId) {
    console.log('network.init');
    var network = networks.get(networkId);
    //Views.addNetwork(network);
    next();
}).after('network._init');

er.on('network.disconnected', function(next, networkId) {
    console.log('network.disconnected');
    var network = networks.get(networkId);
    Views.disconnectNetwork(network);
    next();
}).after('network.init');

er.on('network.connected', function(next, networkId) {
    console.log('network.connected');
    var network = networks.get(networkId);
    var buffers = network.getBufferCollection();
    reviver.afterReviving(buffers, function(obj) {
        Views.connectNetwork(network, obj);
    });
    next();
}).after('network.init');

er.on('network.addbuffer', function(next, networkId, bufferId) {
    console.log('addbuffer');
    var network = networks.get(networkId);
    var buffer = network.getBufferCollection().getBuffer(bufferId);
    reviver.afterReviving(buffer, function(obj) {
        if (obj.isStatusBuffer()) {
//            Views.setStatusBuffer(network.networkName, obj);
        }
        else {
//            Views.addBuffer(network.networkName, obj);
        }
        next();
    });
}).after('network.init');

er.on('change', function(next, networkId, change) {
    if (!jsonpatch.apply(networks.get(networkId), change)) {
        console.log('Patch failed!');
    }
    else {
        clearTimeout(changesTimeout[networkId]);
        changesTimeout[networkId] = setTimeout(function() {
            reviver.reviveAll(networks.get(networkId));
        }, 100);
    }
    next();
}).after('network.init');

er.on('buffer.backlog', function(next, bufferId, messageIds) {
    loadingMoreBacklogs[''+bufferId] = false;
    console.log('buffer.backlog : ' + bufferId);
    if (Views.isBufferShown(bufferId)) {
        var buffer = networks.findBuffer(bufferId), i = 0;
        for (; i<messageIds.length; i++) {
            var message = buffer.messages.get(messageIds[i]);
            Views.prependMessage(message);
        }
    }
    next();
}).after('network.addbuffer');

er.on('buffer.markerline', function(next, bufferId, messageId) {
    console.log('buffer.markerline : ' + bufferId + ", " + messageId);
    // TODO
    next();
}).after('network.addbuffer');

er.on('buffer.lastseen', function(next, bufferId, messageId) {
    console.log('buffer.lastseen : ' + bufferId + ", " + messageId);
    messageId = parseInt(messageId, 10);
    var buffer = networks.findBuffer(bufferId);
    if (buffer !== null && !buffer.isLast(messageId) && buffer.messages.has(messageId)) {
        Views.bufferHighlight(bufferId);
    }
    next();
}).after('network.addbuffer');

er.on('buffer.message', function(next, bufferId, messageId) {
    console.log('buffer.message : ' + bufferId + ", " + messageId);
    var buffer = networks.findBuffer(bufferId);
    var message = buffer.messages.get(parseInt(messageId, 10));
    if (Views.isBufferShown(bufferId)) {
        Views.addMessage(message, Views.scrollOnNewMessage);
        socket.emit('markBufferAsRead', bufferId, messageId);
    } else {
        Views.bufferHighlight(bufferId, message);
    }
    next();
}).after('network.addbuffer');

er.on('buffer.activate', function(next, bufferId) {
    Views.activateBuffer(bufferId);
    next();
}).after('network.addbuffer');

er.on('buffer.unhide', function(next, bufferId, type) {
    Views.unhideBuffer(bufferId);
    next();
}).after('network.addbuffer');

er.on('buffer.hidden', function(next, bufferId, type) {
    Views.hideBuffer(bufferId);
    next();
}).after('network.addbuffer');

er.on('buffer.remove', function(next, bufferId) {
    Views.removeBuffer(bufferId);
    next();
}).after('network.addbuffer');

er.on('channel.join', function(next, bufferId, nick) {
    if (Views.isBufferShown(bufferId)) {
        var buffer = networks.findBuffer(bufferId);
        var user = networks.get(buffer.network).getUserByNick(nick);
        Views.addUser(buffer, user);
    }
    next();
});

er.on('user.quit', function(next, networkId, nick) {
    var network = networks.get(networkId);
    // TODO
});

er.on('user.part', function(next, networkId, nick, bufferName) {
    var network = networks.get(networkId);
    var buffer = network.getBuffer(bufferName);
    if (Views.isBufferShown(buffer.id)) {
        Views.removeUser(buffer, nick);
    }
    next();
});
*/


$(document).ready(function() {

    $(document).on("click", ".add-channel", function() {
        var NetworkId = $(this).data('network');
        $("#join-network-name").html(NetworkId);
    });

    $(".logout, .reconnect").on("click", function() {
        Views.showLoginPage();
    });

    $('#modal-join-channel').on('hidden.bs.modal', function() {
        $('#modal-join-channel-name').val("");
    });

    $(".logout").on("click", function(evt) {
        socket.emit('logout');
        window.location.reload();
    });
    
    $(".reconnect").on("click", function(evt) {
        window.location.reload();
    });
});
