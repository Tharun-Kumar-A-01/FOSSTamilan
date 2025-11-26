let communities_section = document.getElementById("communities-container");

const template = `
				<div class="community-card">
					<div class="img-and-location">
						<img class="logo-img" src="../assets/groups.svg" alt="LOGO">
						<p class="location">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#d3d3d3"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
							{{location}}
						</p>
					</div>
					<a href="{{website}}"><h1 class="community-name">{{community-name}}</h1></a>
					<div class="links-container">
						{{links-container}}
					</div>
				</div>`;

const link_template = `
						<a class="link-box" href="{{link-url}}">
							<img src="{{svg-src}}" alt="{{website}}">
						</a>`

let communities = [];
async function run() {

	// fetch events.json directly from github repo of tamilnadu.tech
	const response = await fetch("https://raw.githubusercontent.com/FOSSUChennai/Communities/refs/heads/main/src/data/communities.json");
	communities = await response.json();
	
	console.log(communities);
	let rendered = "";
	if (communities.length === 0) {
		rendered = "<h1>Unable to Fetch Communities</h1>"; // fallback message
	} else {
		communities.map(({name, logo, location, website, twitter, discord, instagram, linkedin, mastadon, reddit, bluesky, github, telegram, youtube}) => {
			
			let links = "";
			
			twitter ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/x.svg")
											.replace("{{link-url}}",twitter)
					: "" ;
			instagram ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/instagram.svg")
											.replace("{{link-url}}",instagram)
					: "" ;
			linkedin ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/linkedin.svg")
											.replace("{{link-url}}",linkedin)
					: "" ;
			mastadon ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/mastadon.svg")
											.replace("{{link-url}}",mastadon)
					: "" ;
			reddit ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/reddit.svg")
											.replace("{{link-url}}",reddit)
					: "" ;
			discord ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/discord.svg")
											.replace("{{link-url}}",discord)
					: "" ;
			bluesky ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/blusky.svg")
											.replace("{{link-url}}",bluesky)
					: "" ;
			telegram ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/telegram.svg")
											.replace("{{link-url}}",telegram)
					: "" ;
			youtube ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/youtube.svg")
											.replace("{{link-url}}",youtube)
					: "" ;
			github ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/github.svg")
											.replace("{{link-url}}",github)
					: "" ;
			website ? links += link_template
											.replace("{{svg-src}}", "../assets/app_icons/website.svg")
											.replace("{{link-url}}",website)
					: "" ;
			

			rendered += template
								.replaceAll("{{community-name}}", name) // replace fields of template string with data
								.replace("../assets/groups.svg", logo ? logo : "../assets/groups.svg")
								.replaceAll("{{location}}", location)   // replaceAll for replacing the string within the title attr.
								.replace("{{website}}", website)
								.replace("{{links-container}}",links?links:"");
		});
	}
	// renders this month events
	communities_section.innerHTML = rendered;
}

run().then()