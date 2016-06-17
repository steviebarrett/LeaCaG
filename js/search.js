var listIndex;		//the position of the cursor within the suggested list
var suggestedTerms;	//the array of suggested result objects loaded via AJAX
var minChars = 2;
var entryhistory = []; // placeholder for now, just ignore until we decide on back button

$('#searchField').on({
	keyup: function(e) {
		var m = false;
		if (e.which == 38 || e.which == 40 || e.which == 13 || e.which == 27) {
			m = navigateList(e, m);
			return;
		}
		$('#suggestions').empty(); //clear any previous selections
		listIndex = -1;
		$('.chosen').removeClass('chosen');
		var $searchString = $(this).val();
		if ($searchString.length >= minChars) {
			//get the list of suggestions from the server
			$.getJSON("api/ajax.php?action=getEnglish&q=" + $searchString, function(data) {
				suggestedTerms = data.results;	//save the results for later use
				$.each(data.results, function(k, v) {
					//assemble the suggested items list
					$('#suggestions').append($('<li id="idx_' + k + '">' + v.en + '</li>'));
				});
				$("#suggestions").show();
				$('#suggestions li').on('click', function () {
					chooseSelectedTerm($(this).html(), parseIndex($(this).attr('id'), "idx"));
				})
			})
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

function navigateList(e, m) {
	var selectedItem = $('li.chosen');
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
		chooseSelectedTerm(selectedItem.html(), parseIndex(selectedItem.attr('id'), 'idx'));
	}	
	return m;
}

//the event handler has to be attached to the document in order to register the dynamically added elements
$(document).on('click', '.lexicopiaLink', function() {
	var id = parseIndex($(this).attr('id'), 'lexicalLink');
	updateContent(id);
	return false;
});

$('#randomEntry').on("click", function() {
	var randomid = target_index[Math.floor(Math.random()*target_index.length)].id; // need to change this to work better
	entryhistory=[randomid]; 
	updateContent(randomid);
	$('#searchField').val("");
	$('#gaelicEquivalentsList').html("");
	return false;
});

/**
 *
 * @param word: the string value of the selected word
 * @param arrayIdx: the position of the selected word within the file's array
 */
function chooseSelectedTerm(term, arrayIdx) {
	$('#searchField').val(term);
	$('#suggestions').hide();
	$('#gaelicEquivalentsList').html("");
	var gds = suggestedTerms[arrayIdx].gds;
	if (gds.length > 1) {
		$('#gaelicEquivalentsList').append("Gaelic equivalents for <i>" + term + "</i>: ");
		for(var i = 0;i < gds.length;i++) {
			$('#gaelicEquivalentsList').append('<a class="lexicopiaLink" id="lexicalLink_' + gds[i].id + '" href="#" >' + gds[i].form + '</a>');
			if (i<(gds.length - 1)) {
				$('#gaelicEquivalentsList').append(', ');
			}
		}
		$('#mainContent').empty();
	}
	else {
		updateContent(gds[0].id);
	}
	selectedItem = null;    //clear the previously selected item
}

/*
	Parses a class attribute in format "idx_xxxx..."
	Returns the index value where index = xxxx
 */
function parseIndex(string, prefix) {
	var regExp = new RegExp(prefix + "_(\\S+).*");	//matches on non-whitespace to avoid capturing other classes
	var matches = regExp.exec(string);
	return matches[1];
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
