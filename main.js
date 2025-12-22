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

  console.log(resJSON);
}

main("rekky1aws");
