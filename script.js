// container elements where rendered data will be inserted
let this_month_events_section = document.getElementById("this-month-events");
let upcoming_events_section = document.getElementById("upcoming-events");
let past_events_section = document.getElementById("past-events");

// template string
// ( it will be used replace the place holders {{...}} with actual data)
const template = `<div class="event-card">
					<p class="event-community">{{community-name}}</p>
					<h1 class="event-title">{{event-title}}</h1>
					<div class="event-info">
						<p class="event-date">{{event-date}}</p>
						<p class="event-time">{{event-time}}</p>
						<a href='{{event-url}}'><button class="add-to-cal-btn">Register</button></a>
					</div>
					<p class="location">{{event-location}}</p>
				</div>`

// this function gets the fetched results and checks wether it is array or not
async function fetchData(url) {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		// Ensure the response is an array, or convert it to one
		if (Array.isArray(data)) {
			return data;
		} else if (typeof data === 'object') {
			return Object.values(data);
		} else {
			throw new Error("Unexpected JSON format");
		}
	} catch (error) {
		console.error("Error fetching JSON data:", error);
		return [];
	}
}

// this gets the array of data splits it into three parts
// this_month, upcoming, past_events
// and then renders them accordingly
let events = [];
async function run() {
	events = await fetchData('https://raw.githubusercontent.com/FOSSUChennai/Communities/refs/heads/main/src/data/events.json');
	console.log(events);

	let past_events = [];
	let this_month = [];
	let upcoming = [];

	// group each event object by date
	events.forEach((event) => {
		eventDate = new Date(event.eventDate);
		today = new Date()
		if (eventDate.getMonth() === today.getMonth() && eventDate.getDate() >= today.getDate() && eventDate.getYear() >= today.getYear()) {
			this_month.push(event)
		}
		else if (eventDate.getMonth() > today.getMonth() && eventDate.getYear() >= today.getYear()) {
			upcoming.push(event)
		}
		else {
			past_events.push(event)
		}
	});

	// debugging purpose
	// console.log(this_month)
	// console.log(upcoming)
	// console.log(past_events)

	let rendered = '';
	if (this_month.length == 0) {
		rendered = "<h1>No events known this month</h1>";    // fallback message
	} else {
		this_month.map(({ communityName, eventName, eventVenue, eventDate, eventTime, eventLink }) => {
			rendered += template.replace("{{community-name}}", communityName)     // replace fields of template string with date
				.replace("{{event-title}}", eventName)
				.replace("{{event-date}}", eventDate)
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				.replace("{{event-url}}", eventLink);
		})
	}

	this_month_events_section.innerHTML = rendered;

	// repeat two more times
	rendered = '';
	if (upcoming.length == 0) {
		rendered = "<h1>No events known to be coming up</h1>";
	} else {
		upcoming.map(({ communityName, eventName, eventVenue, eventDate, eventTime, eventLink }) => {
			rendered += template.replace("{{community-name}}", communityName)
				.replace("{{event-title}}", eventName)
				.replace("{{event-date}}", eventDate)
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				.replace("{{event-url}}", eventLink);
		})
	}

	upcoming_events_section.innerHTML = rendered;

	rendered = '';
	if (past_events.length == 0) {
		rendered = "<h1>Memory Corrupt! No history available</h1>";
	} else {
		past_events.map(({ communityName, eventName, eventVenue, eventDate, eventTime, eventLink }) => {
			rendered += template.replace("{{community-name}}", communityName)
				.replace("{{event-title}}", eventName)
				.replace("{{event-date}}", eventDate)
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				.replace("{{event-url}}", eventLink);
		})
	}

	past_events_section.innerHTML = rendered;
}

run();    // initiate fetching and rendering