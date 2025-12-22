process.loadEnvFile("./.env");

async function main(username) {
  const url = `https://api.github.com/graphql`
  const token = process.env.TOKEN;

  const query = `
	query($userName:String!) {
	  user(login: $userName){
	    contributionsCollection {
	      contributionCalendar {
	        totalContributions
	        weeks {
	          contributionDays {
	            contributionCount
	            date
	          }
	        }
	      }
	    }
	  }
	}
	`;

  const variables = `
		{
			"userName": "${username}"
		}
	`;

  const body = {
    query,
    variables
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const resJSON = await res.json();
  const weeks = resJSON.data.user.contributionsCollection.contributionCalendar.weeks;
  /* forEach((elt) => {
    console.log(elt);
  }); */

  for (let i = 0; i < 7; i++) {
    let commitLine = "";
    weeks.forEach((week) => {
      if (week.contributionDays.length > i) {
        let spacing = ""
        let spacingSize = 0;
        week.contributionDays.forEach((day) => {
          if (`${day.contributionCount}`.length > spacingSize) {
            spacingSize = `${day.contributionCount}`.length;
          }
        });
        for (let j = 0; j < spacingSize - `${week.contributionDays[i].contributionCount}`.length + 1; j++) {
          spacing = `${spacing} `;
        }
        commitLine = `${commitLine}${week.contributionDays[i].contributionCount}${spacing}`;
      }
    });

    console.log(commitLine);
  }
}

// MAIN
console.log(process.argv);
const username = process.argv[2];
main(username);
