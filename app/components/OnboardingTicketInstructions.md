# First, please DOWNLOAD "Markdown All in One" VSCode Extension!
Once downloaded you can preview this MarkDown file using the new button that shows up on the top right of VSCode. It looks like a box with a magnifying glass. Or just use the Google Doc link: https://docs.google.com/document/d/1hZsiLnx_p0q4PVpp5EKF-vWXJpySX4cjgYHaDrMcwKE/edit#heading=h.131m6gidqt8y


# **Your First Ticket: A Full Stack Button**

Hello developers\! Your PM and TL have tasked you with an important mission: to create a button that retrieves the current weather. This tutorial ticket will reinforce concepts that you learned in the Jumbo Code Workshop B on React, and introduce you to the concept of APIs. You can refer back to the workshop reference sheets [here](https://jumbocode.ben.page/reference), or read through the official React quick-start [tutorial](https://react.dev/learn), if you need help.

## 🎯 **Your Ticket**

Your PM and TL care a lot about the weather. In fact, they want you to build a **Button** component that retrieves the weather, so that they can display the weather on any website that they build\!

Typically, your assigned tickets will outline the primary **goals**, or **features**, that your work on the ticket should accomplish. The goals here were written with some extra details and guidance to help you get used to writing code for tickets in Jumbo Code\!

**⌨️ Getting Set Up**

1. First, create a new branch on your team’s github repository, named “**yourlastname/button**”.  
   1. Following the steps in the Jumbo Code Workshop A, this will create a local branch in your local copy of the repository. We’ll push the work you do to the remote repository later.   
2. Then, create a file to hold your new button component. If your project is using Javascript, name it **Button.jsx**; and, if your project is using Typescript, name it **Button.tsx**. Your project will have a designated folder for component files, most likely named **src/components**\! Your PM and TL will tell you where you can put your button file.

**☁️ Building the Button Component**

1. Create a **Button** component in **Button.jsx**. (or **Button.tsx** if you’re using Typescript). It should take a single prop, called **label**, which specifies the text on the button.  
   1. Feel free to style the button however you like\! Add a border, change the text styling, or even make the button change colors on hover.

**💬 Fetching the Weather**

1. Finally, you’ll hook up your **Button** to the weather API. When a user clicks your button, the button should call a function that *fetches* HTTP data from a web endpoint. Follow the format of the code snippet below to retrieve data from the weather API, and print it to the console.  
   1. You can use this specific URL endpoint to retrieve the weather for the Tufts area: "[https://api.weather.gov/gridpoints/BOX/69,92/forecast](https://api.weather.gov/gridpoints/BOX/69,92/forecast)"  
   2. Essentially, calling the **fetch()** function retrieves information from an endpoint on the web. This returns an object called a Promise that contains the data you retrieved. You call the **.then()** function on this object to convert the web response to JSON, and call **.then()** again to work with the JSON data.   
2. After printing out the weather JSON data, extract the temperature and weather (sunny, cloudy, rainy), and print it to the console.  
3. Finally, you’ll want your button to update the text below it with the current temperature and weather. Can you store the current temperature and weather in a variable that’s updated after this data is fetched?  
   1. You’ll likely want to use the function **useState()** for this. You can check out the Jumbo Code Workshop C reference sheet, once it’s released, for more information. Or, read this [article](https://react.dev/learn/reacting-to-input-with-state) for an excellent walkthrough guide on what state is, why it’s powerful, and how to use it\!

	  
💻 Review the Workshop C guide to learn more about how to use APIs and state in React\!

Once you’re finished, follow the instructions in the Jumbo Code Workshop A to push your code to your remote repository and open a PR for it. Great work\! 