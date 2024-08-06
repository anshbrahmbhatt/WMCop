function selectPersonality(personality) {
    switch (personality) {
        case 'Michael':
            window.location.href = '../templates/michael.html';
            break;
        case 'Trevor':
            window.location.href = '../templates/trevor.html';
            break;
        case 'Franklin':
            window.location.href = '../templates/franklin.html';
            break;
        default:
            // Handle default case or error
            break;
    }
}


prompt("Hello");