var listIndex;		//the position of the cursor within the suggested list
var suggestedTerms;	//the array of suggested result objects loaded via AJAX
var minChars = 2;
var entryhistory = []; // placeholder for now, just ignore until we decide on back button

$('#englishSearchField').on({
	keyup: function(e) {
		var m = false;
		if (e.which == 38 || e.which == 40 || e.which == 13 || e.which == 27) {
			m = navigateList(e, m, 'en');
			return;
		}
		$('#suggestions').empty(); //clear any previous selections
		listIndex = -1;
		$('.chosen').removeClass('chosen');
		var searchString = $(this).val();
		if (searchString.length >= minChars) {
			//get the list of suggestions from the server
			$.getJSON("api/ajax.php?action=getEnglish&q=" + searchString, function(data) {
				suggestedTerms = data.results;	//save the results for later use
				$.each(data.results, function(k, v) {
					//assemble the suggested items list
					$('#suggestions').append($('<li>' + v.en + '</li>'));
				});
				$("#suggestions").show();
				$('#suggestions li').on('click', function () {
					$(this).addClass('chosen');
					chooseSelectedTerm($(this).html(),'en');
				})
			})
		}
        else {
            $("#suggestions").hide(); // hide when backspace is pressed and just one character in field
        }
    },
	keydown: function(e) {
		if (e.which == 38 || e.which == 40 || e.which == 13) {
			e.preventDefault();
		}
	},
	click: function() {     
		$(this).val("");	//clear the search field for a new query
	}
});

function navigateList(e, m, lang) {
	if (e.which == 38) {    	//Up arrow
		listIndex--;
		if (listIndex < 0) {
			listIndex = 0;
		}
		m = true;
	}
	else if (e.which == 40) {   //Down arrow
		listIndex++;
		if (listIndex > $('#suggestions li').length - 1) {
			listIndex = $('#suggestions li').length - 1;
		}
		m = true;
	}
	if (m) {
		$('#suggestions li.chosen').removeClass('chosen');
		$('#suggestions li').eq(listIndex).addClass('chosen');
	} else if (e.which == 27) {     //ESC key
		$('#suggestions').hide();
	} else if (e.which == 13) {  	//Enter key
		var n = $('.chosen').index();
		if (n != -1) { // some list item is selected
            var selectedItem = $('li.chosen');
            chooseSelectedTerm(selectedItem.html(),lang);
		}
	}	
	return m;
}

//the event handler has to be attached to the document in order to register the dynamically added elements
$(document).on('click', '.lexicopiaLink', function() {
	var id = $(this).attr('href');
	updateContent(id);
	return false;
});

//close the suggestions link on click outside search
$(document).mouseup(function(e) {
	if (!$('#suggestions').is(e.target) && $('#suggestions').has(e.target).length === 0) {
		$('#suggestions').hide();
	}
});

$('#randomEntry').on("click", function() {
	$('#englishSearchField').val("");
	$('#gaelicSearchField').val("");
	$('#gaelicEquivalentsList').html("");
	$.getJSON("api/ajax.php?action=getRandom", function(data) {
		var randomid = data.randomEntry.id; // THIS DOESN'T WORK
        entryhistory=[randomid];
        updateContent(randomid);
        return false;
	})
});

/**
 *
 * @param word: the string value of the selected word
 * @param arrayIdx: the position of the selected word within the file's array
 */
function chooseSelectedTerm(term, lang) {
	$('#englishSearchField').val("");
    $('#gaelicSearchField').val("");
	$('#suggestions').hide();
	$('#gaelicEquivalentsList').empty();
    if (lang=='en') {
        var gds = suggestedTerms[$('.chosen').index()].gds;
        if (gds.length > 1) {
            $('#gaelicEquivalentsList').append("Gaelic equivalents for <i>" + term + "</i>: ");
            for(var i = 0;i < gds.length;i++) {
                $('#gaelicEquivalentsList').append('<a class="lexicopiaLink" href="' + gds[i].id + '">' + gds[i].form + '</a>');
                if (i<(gds.length - 1)) {
                    $('#gaelicEquivalentsList').append(', ');
                }
            }
            $('#mainContent').empty();
        }
        else {
            updateContent(gds[0].id);
        }
    }
	else if (lang=='gd') {
        updateContent(suggestedTerms[$('.chosen').index()].id);
    }
}

function updateContent(id) {
	// update the content panel when a new lexical entry is selected
	$('#mainContent').load('../lexicopia/gd/entries/' + id + ".html");
}

function showEnglish(id) {
	$("#en-minus-" + id).show();
	$("#en-plus-" + id).hide();
	$("#en-text-" + id).show();
}

function hideEnglish(id) {
	$("#en-minus-" + id).hide();
	$("#en-plus-" + id).show();
	$("#en-text-" + id).hide();
}

$('#enToGdToggle').on("click", function() {
    $('#suggestions').hide();
	$('#englishSearchField').val("");
	$('#gaelicEquivalentsList').empty();
	$('#mainContent').empty();
	$("#englishSearchForm").hide();
	$("#gaelicSearchForm").show();
    $('#gaelicSearchField').focus();
	return false;
});

$('#gdToEnToggle').on("click", function() {
    $('#suggestions').hide();
	$('#gaelicSearchField').val("");
	$("#englishSearchForm").show();
	$("#gaelicSearchForm").hide();
    $('#mainContent').empty();
    $('#englishSearchField').focus();
	return false;
});

$('#gaelicSearchField').on({
	keyup: function (e) {
		var m = false;
		if (e.which == 38 || e.which == 40 || e.which == 13 || e.which == 27) {
			m = navigateList(e, m, 'gd');
			return;
		}
		$('#suggestions').empty(); //clear any previous selections
		listIndex = -1;
		$('.chosen').removeClass('chosen');
		var searchString = $(this).val();
		if (searchString.length >= minChars) {
			//get the list of suggestions from the server
			$.getJSON("api/ajax.php?action=getGaelic&q=" + searchString, function(data) {
				suggestedTerms = data.results;	//save the results for later use
				$.each(data.results, function(k, v) {
					//assemble the suggested items list
					$('#suggestions').append($('<li>' + v.word + '</li>'));
				});
				$("#suggestions").show();
				$('#suggestions li').on('click', function () {
					$(this).addClass('chosen');
					chooseSelectedTerm($(this).html(), 'gd'); // this needs to be done later
				})
			})
		}
        else {
            $("#suggestions").hide(); // hide when backspace is pressed and just one character in field
        }
	},
	keydown: function(e) {
		if (e.which == 38 || e.which == 40 || e.which == 13) {
			e.preventDefault();
		}
	},
	click: function() {
		$(this).val("");	//clear the search field for a new query
	}
});
