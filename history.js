
$(function () {
    $('#search').change(function () {
        $('#history').empty();
        const query = $('#search').val();
        if (query && query !== "") {
            searchHistories(query);
        }
    });
});

function searchHistories(query) {
    const oneWeekAgo = 24*3600*1000*7;
    const historyItems = chrome.history.search({
            'text': query.toString(),
            'startTime': new Date().getTime()-oneWeekAgo,
            'endTime': new Date().getTime(),
            'maxResults': 20
        },
        function (historyItems) {
            if (historyItems.length > 0) {
                $('#label_history').empty().append('History');
            }
            for (let i = 0; i < historyItems.length; ++i) {
                addHistories(historyItems[i]);
                console.info(historyItems[i]);
            }
        });
    console.info(historyItems);
}

function addHistories(historyItem) {
    const url = historyItem.url;
    if (url) {
        const li = $('<li>');
        const anchor = $('<a>');
        anchor.attr('href', url);
        if (!historyItem.title || historyItem.title === '') {
            anchor.text(url);
        } else {
            anchor.text(historyItem.title);
        }

        anchor.click(function () {
            chrome.tabs.create({url: url});
        });
        li.append(anchor);
        $('#history').append(li);
    }
}