
$(function () {
    $('#search').change(function () {
        $('#bookmarks').empty();
        const query = $('#search').val();
        if (query && query !== "") {
            $('#label_marks').empty().append('<br>Masks');
            dumpBookmarks(query);
        }
    });
});

function dumpBookmarks(query) {
    const bookmarkTreeNodes = chrome.bookmarks.getTree(
        function (bookmarkTreeNodes) {
            dumpTreeNodes(bookmarkTreeNodes, query)
        });
    console.info(bookmarkTreeNodes);
}

function dumpTreeNodes(bookmarkNodes, query) {
    let i;
    for (i = 0; i < bookmarkNodes.length; i++) {
        $('#bookmarks').append(dumpNode(bookmarkNodes[i], query));
    }
}

function dumpNode(bookmarkNode, query) {
    const li = $('<li>');
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        dumpTreeNodes(bookmarkNode.children, query);
    } else {
        if (bookmarkNode.url) {
            if (!bookmarkNode.children) {
                if (String(bookmarkNode.title).indexOf(query) === -1
                    && String(bookmarkNode.url).indexOf(query) === -1) {
                    return $('<span></span>');
                }
                const anchor = $('<a>');
                anchor.attr('href', bookmarkNode.url);
                anchor.text(bookmarkNode.title ? bookmarkNode.title : bookmarkNode.url);
                anchor.click(function () {
                    chrome.tabs.create({url: bookmarkNode.url});
                });
                li.append(anchor);
            }
            return li;
        }
    }
}