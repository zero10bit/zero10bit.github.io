// define variables
var $choreInput = $('#choreInput');
var $pointsInput = $('#pointsInput');
var $choreList = $('#choreList tbody');
var $addChoreButton = $('#addChoreButton');
var $randomPointsButton = $('#randomPointsButton');
var $clearDataButton = $('#clearDataButton');
var $monsterImage = $('#monsterImage');
var $hitPoints = $('#hitPoints');
var $hitPointsPercentage = $('#hitPointsPercentage');
var $feedback = $('#feedback');
var totalChorePoints = 0;

// helper functions
function addChore(chore, points) {
    var $choreRow = $('<tr>');
    $choreRow.append('<td><input type="checkbox"></td>');
    $choreRow.append('<td>' + chore + '</td>');
    $choreRow.append('<td>' + points + '</td>');
    $choreRow.append('<td><button class="delete"></button></td>');
    $choreList.append($choreRow);
    animateMonster('attack');
    totalChorePoints += parseInt(points);
    updateHitPoints();
    feedback('Chore added successfully!');
}

function updateHitPoints() {
    var remainingPoints = totalChorePoints;
    $choreList.find('tr').each(function() {
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            remainingPoints -= parseInt($(this).children('td').eq(2).text());
        }
    });
    var percentage = (remainingPoints / totalChorePoints) * 100;
    $hitPoints.css('width', percentage + '%');
    $hitPointsPercentage.text(Math.round(percentage) + '%');
    
    // Update the gradient color based on percentage
    if (percentage >= 75) {
        $hitPoints.css('background', 'linear-gradient(to right, green, yellow)');
    } else if (percentage >= 50) {
        $hitPoints.css('background', 'linear-gradient(to right, yellow, orange)');
    } else if (percentage >= 25) {
        $hitPoints.css('background', 'linear-gradient(to right, orange, red)');
    } else {
        $hitPoints.css('background', 'red');
    }
    
    if (percentage <= 0) {
        animateMonster('death');
        feedback('Congratulations! You have defeated the chore dragon!');
        setTimeout(clearData, 5000);
    }
}

function animateMonster(animation) {
    $monsterImage.attr('src', 'monsters/' + animation + '.gif');
    setTimeout(function() {
        $monsterImage.attr('src', 'monsters/idle.gif');
    }, 5000);
}

function feedback(message) {
    $feedback.text(message).fadeIn().delay(3000).fadeOut();
}

function clearData() {
    $choreList.empty();
    animateMonster('idle');
    totalChorePoints = 0;
    updateHitPoints();
    feedback('All data cleared!');
}

// event listeners
$addChoreButton.click(function() {
    var chore = $choreInput.val();
    var points = $pointsInput.val();
    if (chore && points) {
        addChore(chore, points);
        $choreInput.val('');
        $pointsInput.val('');
    } else {
        feedback('Please provide both chore and points!');
    }
});

$randomPointsButton.click(function() {
    $pointsInput.val(Math.floor(Math.random() * 50) + 1);
});

$clearDataButton.click(function() {    clearData();
});

$(document).on('change', 'input[type="checkbox"]', function() {
    animateMonster('hurt');
    updateHitPoints();
    feedback('Chore marked as done!');
});

$(document).on('click', '.delete', function() {
    var points = $(this).closest('tr').children('td').eq(2).text();
    totalChorePoints -= parseInt(points);
    $(this).closest('tr').remove();
    animateMonster('attack');
    updateHitPoints();
    feedback('Chore removed successfully!');
});
