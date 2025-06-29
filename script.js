// container elements where rendered data will be inserted
let this_month_events_section = document.getElementById("this-month-events");
let upcoming_events_section = document.getElementById("upcoming-events");
let past_events_section = document.getElementById("past-events");

// template string
// used for rendering cards in a react component style
// ( it will be used replace the place holders {{...}} with actual data)
const template = `<div class="event-card">
					<p class="event-community">{{community-name}}</p>
					<h1 class="event-title">{{event-title}}</h1>
					<div class="event-info">
						<p class="event-date">{{event-date}}</p>
						<p class="event-time">{{event-time}}</p>
						<a href='{{event-url}}'><button class="register-btn">Register</button></a>
					</div>
					<p class="location">{{event-location}}</p>
				</div>`

// template for past event cards, this one has custom classname and dont have the register button
const past_events_template = `<div class="past event-card">
					<p class="past event-community">{{community-name}}</p>
					<h1 class="past event-title">{{event-title}}</h1>
					<div class="past event-info">
						<p class="past event-date">{{event-date}}</p>
						<p class="past event-time">{{event-time}}</p>
					</div>
					<p class="past location">{{event-location}}</p>
				</div>`


let events = [];
async function run() {

	// fetch events.json directly from github repo of tamilnadu.tech
	const response = await fetch('https://raw.githubusercontent.com/FOSSUChennai/Communities/refs/heads/main/src/data/events.json');
	events = await response.json();
	
	console.log(events);
	
	// this fetches past events from a different json
	const past_events_response = await fetch('https://raw.githubusercontent.com/FOSSUChennai/Communities/refs/heads/main/src/data/pastevents.json');
	let past_events = await past_events_response.json();
	
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

	this_month = this_month.sort((a,b)=>{
		const A = new Date(`${a.eventDate}`);
		const B = new Date(`${b.eventDate}`);
		return A - B;
	})
	upcoming = upcoming.sort((a,b)=>{
		const A = new Date(`${a.eventDate}`);
		const B = new Date(`${b.eventDate}`);
		return A - B;
	})
	past_events = past_events.slice(-6).sort((a,b)=>{
		const A = new Date(`${a.eventDate}`);
		const B = new Date(`${b.eventDate}`);
		return B - A;
	})
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
				.replace("{{event-date}}", eventDate.split('-').reverse().join('-'))
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				.replace("{{event-url}}", eventLink);
		})
	}
	// renders this month events
	this_month_events_section.innerHTML = rendered;

	// repeat two more times
	rendered = '';
	if (upcoming.length == 0) {
		rendered = "<h1>No events known to be coming up</h1>";
	} else {
		upcoming.map(({ communityName, eventName, eventVenue, eventDate, eventTime, eventLink }) => {
			rendered += template.replace("{{community-name}}", communityName)
				.replace("{{event-title}}", eventName)
				.replace("{{event-date}}", eventDate.split('-').reverse().join('-'))
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				.replace("{{event-url}}", eventLink);
		})
	}
	// renders upcoming events
	upcoming_events_section.innerHTML = rendered;

	rendered = '';
	if (past_events.length == 0) {
		rendered = "<h1>Memory Corrupt! No history available</h1>";
	} else {
		past_events.map(({ communityName, eventName, eventVenue, eventDate, eventTime, eventLink }) => {
			rendered += past_events_template.replace("{{community-name}}", communityName)
				.replace("{{event-title}}", eventName)
				.replace("{{event-date}}", eventDate.split('-').reverse().join('-'))
				.replace("{{event-time}}", eventTime)
				.replace("{{event-location}}", eventVenue)
				// no event-url here
		})
	}
	// renders past events
	past_events_section.innerHTML = rendered;
	
}

run();    // initiate fetching and rendering