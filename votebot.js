// author Alexandr V Kurtz
// under MIT license
// version 2017/05/05
// vote bot 
// a bot that can do yes or no votes on discord, and also randomly generate ints

var Discord = require("discord.js");
var client = new Discord.Client();
var votes=[]; // array of votes bot is processing

client.on
(
"message", msg => 
{
    if (msg.content.toLowerCase().startsWith("==vote")&&msg.content.length>7) 
	{
		var novote=true; // boolean that checks if vote is going on in current channel 
		if(votes.length>0)
			for(var i=0;i<votes.length;i++) // look through votes
			{
				if(msg.channel.equals(votes[i].channel)) // if the channel already has a vote going on
				{
					msg.channel.sendMessage("you can't, there's already a vote going on right now");
					novote=false; // don't add vote
					break;
				}
			}
        if(novote) // if no vote going on 
        {
			var vote=
			{
				channel : msg.channel, // the channel of the vote 
				question : msg.content.substring(6,msg.content.length), // the question being asked
				y : 0, // votes for yes 
				n : 0, // votes for no 
				voters : [] // list of people who have voted 
			};
			msg.channel.sendMessage
				(
					vote.question+"\n"+
					"y: "+vote.y+"\n"+
					"n: "+vote.n+"\n"+
					"type y or yes for y and n or no for no"
				);
			votes.push(vote); // add vote to array of votes
        }
    }
	
	if(((msg.content.toLowerCase().startsWith("y"))&&msg.content.length==1)||((msg.content.toLowerCase().startsWith("yes"))&&msg.content.length==3)) // if voting yes 
	{
		if(votes.length>0)
			for(var i=0;i<votes.length;i++) // look through votes
			{
				if(msg.channel.equals(votes[i].channel)) // if vote is going on 
				{
					var canvote=true; // checks to see if user has already voted
					for(var n=0;n<votes[i].voters.length;n++) // looks through voters of vote 
					{
						if(msg.author.equals(votes[i].voters[n])) // if user has already voted 
						{
							canvote=false; // can't vote 
							break;
						}
					}
					if(canvote)
					{
						votes[i].y++; // add yes vote
						votes[i].voters.push(msg.author); // add user to voter list so he can't vote again 
					}
					break;
				}
			}
	}
	
	if(((msg.content.toLowerCase().startsWith("n"))&&msg.content.length==1)||((msg.content.toLowerCase().startsWith("no"))&&msg.content.length==2)) // if voting no
	{
		if(votes.length>0)
			for(var i=0;i<votes.length;i++) // look through votes
			{
				if(msg.channel.equals(votes[i].channel)) // if vote is going on 
				{
					var canvote=true; // checks to see if user has already voted
					for(var n=0;n<votes[i].voters.length;n++) // looks through voters of vote 
					{
						if(msg.author.equals(votes[i].voters[n])) // if user has already voted 
						{
							canvote=false; // can't vote 
							break;
						}
					}
					if(canvote)
					{
						votes[i].n++; // add no vote
						votes[i].voters.push(msg.author); // add user to voter list so he can't vote again 
					}
					break;
				}
			}
	}
	
	if(msg.content.toLowerCase().startsWith("==results"))
	{
		if(votes.length>0)
			for(var i=0;i<votes.length;i++) // look through votes 
				if(msg.channel.equals(votes[i].channel)) // if vote is happening 
				{
					msg.channel.sendMessage
					(
						votes[i].question+"\n"+
						"y: "+votes[i].y+"\n"+
						"n: "+votes[i].n+"\n"+
						"type is y or yes for y and n or no for no"
					);
					break;
				}
	}
	
	if(msg.content.toLowerCase().startsWith("==end"))
	{
		if(votes.length>0)
			for(var i=0;i<votes.length;i++) // look through votes 
				if(msg.channel.equals(votes[i].channel)) // if vote is happening 
				{
					msg.channel.sendMessage
					(
						votes[i].question+"\n"+
						"y: "+votes[i].y+"\n"+
						"n: "+votes[i].n+"\n"+
						"voting is now over, thank you"
					);
					votes.splice(i,i+1); // officially end vote so new one can start 
					break;
				}
	}
	
	if(msg.content.toLowerCase().startsWith("==votes"))
	{
		msg.channel.sendMessage("there are currently "+votes.length+" votes happening right now");
	}
	
	if(msg.content.toLowerCase().startsWith("==random ")&&msg.content.toLowerCase().length>11) // generates random number
	{
		var sm=msg.content.split(" ");
		var min=parseInt(sm[1]);
		var max=parseInt(sm[2]);
		var dif=max-min;
		var rand=Math.floor((Math.random()*dif)+min);
		if(rand.toString()=="NaN")
			msg.channel.sendMessage
			(
				"format must be \n"+
				"'==random <minimum number> <maximum number>'"
			);
		else
			msg.channel.sendMessage(rand.toString());
	}
	
    if(msg.content.toLowerCase().startsWith("==help"))
    {
        msg.channel.sendMessage
		(
			"if you want to start a vote, type in '==vote' followed by the voting question \n"+
			"unfortunately I can only do yes or no questions for now \n"+
			"if you ever want to see the current results say '==results' \n"+
			"to end voting, say '==end' \n"+
			"to see how many votes are currently happen, say ==votes \n"+
			"to find a random int, say ==random followed by the minimum and maximum number \n"+
			"to see changelog, say '==changelog'\n"+
			"made by alex kurtz"
		);
    }
	
	if(msg.content.toLowerCase().startsWith("==test"))
	{
		msg.channel.sendMessage("I am online and working"); // used to make sure votebot is online
	}
}
);

client.on
(
'ready', () => 
{
  console.log('should be running');
}
);

client.login(""); // client token goes here
