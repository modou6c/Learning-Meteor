import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


// accounts helpers
 Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			if(Session.get('searchInput')) { 
				var searchString = Session.get('searchInput');
				return Websites.find({title: {'$regex' : '.*' + searchString || '' + '.*'} } ,
				 {sort: { voting: -1 , createdOn: -1 }});
			}
			else {
				return Websites.find({}, {sort: { voting: -1 , createdOn: -1 }});
			}
		},
		searching_websites: function() {
			if(Session.get('searchInput')) {
				return true;
			} else {
				return false;
			}
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			var voting = 1; // upvoting
			var upvote = 1;
			var website = Websites.findOne({_id:website_id});
			if(website.voting) { 
				// if we've already voted for this website then increase the vote
				voting = voting + website.voting;
				upvote = upvote + website.upvotes;
			}

			Websites.update({_id:website_id}, 
                    {$set: {voting:voting}});
			Websites.update({_id:website_id}, 
                    {$set: {upvotes:upvote}});
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var voting = -1; // downvoting
			var downvote = 1;
			var website = Websites.findOne({_id:website_id});
			if(website.voting) { 
				// if we've already voted for this website then decrease the vote
				voting = website.voting - 1;
				downvote = downvote + website.downvotes;
			}

			Websites.update({_id:website_id}, 
                    {$set: {voting:voting}});

			Websites.update({_id:website_id}, 
                    {$set: {downvotes:downvote}});

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var desc = event.target.description.value;
			console.log("The url they entered is: "+url);
			
			if(url && desc) { // required fields
				var title = event.target.title.value;
			//  put your website saving code in here!	
			   if (Meteor.user()){
		          Websites.insert({
		            title:title, 
    				url:url, 
    				description:desc, 
		            createdOn:new Date(),
		            voting : 0,
		            downvotes:0,
		            upvotes:0,
		            createdBy:Meteor.user()._id
		          });
		      	}
		      	else {
		      		alert("To add a website, you should be connected ");
		      	}
		      }
		      else {
		      	alert("The website should have an URL and a description");
		      }
			return false;// stop the form submit from reloading the page

		}
	});

