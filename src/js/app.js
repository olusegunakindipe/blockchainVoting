// jsSHA = require("jssha");
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  registernin:[],
  votednin:[],
  votedAccount:[],
  usernin:null,
  registrationDeadline:new Date("06/09/2019"),
  votingDeadline:new Date("06/09/2019"),
  votingEnded : false,
  //eventadd: event.address,
  //globalAdd: address,
  //hasVoted: false,
  
  init: async () =>
  {
    // Load candidates.

    $.getJSON('../candidates.json', function(data) {
      //let data="";

      let content = $('#content');
      let candidateTemplate = $('#candidateTemplate');
     for (let i in data) 
     {

      if(data.hasOwnProperty(i))       
      {
      candidateTemplate.find('.panel-title').text(data[i].name);         
      candidateTemplate.find('.candidate-name').text(data[i].name);
      candidateTemplate.find('#img1').attr('src', data[i].picture);
      candidateTemplate.find('.candidate-age').text(data[i].age);
      candidateTemplate.find('.candidate-post').text(data[i].post);
      candidateTemplate.find('.candidate-party').text(data[i].party);
      candidateTemplate.find('#logo').attr('src', data[i].logo);
      candidateTemplate.find('.btn-vote').attr('data-id', data[i].id);
      //document.querySelector(".candidate-name").innerHTML = `${name}`;
      content.append(candidateTemplate.html());}
      };
    });
    return await App.initWeb3();     
  },
  
    initWeb3: async ()=> 
    {
     if(window.ethereum){

      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      }catch(error){
        console.error ("User denied account access")
      }
     }
     else if (window.web3){
       App.web3Provider = window.web3.currentProvider;
     }
     else{
       App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
       web3 = new Web3(App.web3Provider);
     }
     return App.initContract();
 },

  initContract: () => 
  {
    $.getJSON("Election.json", (election) => 
    {
      
      App.contracts.Election = TruffleContract(election);

      App.contracts.Election.setProvider(App.web3Provider);      
      //App.addedEvent();
   App.bindEvents();
    //App.ValidateUSers()
    return App.render();
    }
    );     
  },

  bindEvents: () =>
   {
    $(document).on('click', '.btn-vote', App.castVote);
    
    App.contracts.Election.deployed().then(function(instance) 
    {
      instance.votedEvent({},
        {
        fromBlock: 0,
        toBlock:'latest'
      } 
      ).watch(function(error, event)
      {
        console.log("event triggered", event)
       // App.render();
      })
    })
  },
  //This does the main function
  render: async () => 
  {
    try
    { 
      
      var loader= $("#loader");
      var content = $("#content");     

      loader.show();
      setTimeout(function(){
      },5000);
      content.hide();    
      //load account data
      web3.eth.getCoinbase(function(err, account)
      {
        if (err===null)
        {
          App.account = account;
          console.log(account);
         // document.querySelector("#accountAddress").innerHTML= `The contract is connected to account: ${account}`;
        }
      });     
      
      //load Contract data
      let instance = await App.contracts.Election.deployed();
      const candidatesCount = await instance.getNumOfCandidates();    
        let candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        for (let i = 1; i<=candidatesCount ; i++)
        { 

          console.log(candidatesCount.toNumber())        
          let candidate = await instance.candidates(i);          
          let id = candidate[0];    
          let name = candidate[1];
          let party = candidate[2];
          let voteCount = candidate[3]; 

          let row = "<tr><th>"+ id + "</th><td>" + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"

           candidatesResults.append(row);     
          };
       let hasVoted = await instance.voted(App.account) ;   
       console.log(hasVoted);
        
      if(hasVoted)
      {
      
        //let awardbool= await instance.Award(App.globalAdd,App.account,1 );
        // web3.eth.getAccounts(function(error, result){
        //   console.log(web3.eth.accounts[0]);
        //   console.log(App.account);
        //   web3.eth.sendTransaction({
        //     from: web3.eth.accounts[3],
        //     to: App.account,
        //     value: web3.toWei(0.001, 'ether'),
        //     data:"0x0"
        //   }, function(err, transactionHash){
        //     if (!err){
        //     alert("you have a bonus of 1 ether.")
        //     let a= App.votedAccount.push(App.token)// push the voters id if the candidate has voted
        //     console.log(a);
        //     $("#content1").hide(); //hide the content and go back to the mainpage
        //     /** check*/
        //     $("#loader1").show();
        //     console.log(transactionHash)}
        //   });
        // });
        //let amount = web3.toWei(1,'ether');
        let award = await instance.withdraw();
        console.log(award);
        if(award){
          
      
        let a= App.votedAccount.push(App.token)// push the voters id if the candidate has voted
        console.log(a);
        $("#content1").hide(); //hide the content and go back to the mainpage
        /** check*/
        $("#loader1").show();}
  
    }
      loader.hide();
      content.show();
      throw new Error("oops");
    }
      catch(err){
        console.log(err)
      }
  }, 
  
  //This function is for voting 
  castVote : async(e) => 
  {
    e.preventDefault();
    
    try{    
      let candidateId = parseInt($(event.target).data('id'));
      console.log(candidateId);

      let instance = await App.contracts.Election.deployed();
      // This calls the function from the contract
      let voting = await instance.vote(candidateId, 
        {
          from: App.account,gas:"6721975"
        });     
      //await voting.send();
     //App.refreshVoteTotals();
      web3.eth.getAccounts((accounts,error) => 
      {
        if(error)
        {
          console.log(error); 
        }  
        if (voting){
        alert('Thank you for Voting!, You have bonus of 0.005gwei');  
       }
        else
        {
          alert('Not Successful')
        } 
        $("#content").hide();     
        $("#loader").show();          
        })
      }       
        catch(err)
        {
          console.log(err.message);
        } 
  },

endVoting :async ()=> 
{
  let instance = await App.contracts.Election.deployed(); 
  let end = await instance.endVoting();
  let success = await end.send();
    if (success) {
      location.reload();
    } else {
      console.log("Error: you don't have permission to end voting.")
    }
},

// addCandidates: ()=>{
//   //const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");
//   var id=$('#id').val(); 
//  // var nin=document.getElementById('nin').value; 
//   var name=$('#name').val(); 
//   var post =$('#post').val(); 
//   var party = $('#party').val();
//   var photo = $('#photo').val();
//   var logo = $('#logo').val();
//   // const data = JSON.stringify({
//   //   id: id,
//   //   name: name,
//   //   post: post,
//   //   party: party,
//   //   photo: photo,
//   //   logo: logo
//   // })
//   // const ipfsHash = await ipfs.add(data);
//   // const instance = await App.contracts.Election.deployed(); 

//   // await instance.setHash.sendTransaction(ipfsHash);
//   // let result = await instance.ipfsHash.call();

//   // console.log(ipfsHash);
//   // console.log(result);

//   // console.log(JSON.parse(await ipfs.cat(result)));
//   var candidates = {
//     data: []
//   };
//   candidates.data.push({
//     id: id,
//     name: name,
//     post: post,
//     party: party,
//     photo: photo,
//     logo: logo
//   })
  
//   let json = JSON.stringify(candidates);
//   const fs = require("fs");
  
//   fs.writeFile('candidates.json', json, 'utf8', callback);

//   fs.readFile('candidates.json', 'utf8', function readingFile(err, data1){
//     if (err){
//       console.log(err);
//     }
//     else{
//       candidates = JSON.parse(data1);
//       candidates.data.push({
//         id: id,
//         name: name,
//         post: post,
//         party: party,
//         photo: photo,
//         logo: logo  
//       });
//       json= JSON.stringify(candidates)
//       fs.writeFile('candidates.json',json,'utf8',callback);
//     }
//   alert ("Candidate Added");
//  let  response = confirm("do you want to add another candidate");
//  if(response){
//   $('#id').val('');
//   $('#name').val('');
//   $('#post').val('');
//   $('#party').val('');  
//   $('#photo').val(''); 
//   $('#logo').val(''); 
// // $("#loader1").show();
// }
// else{
//   $("#content3").hide();     
//   $("#loader3").show();}
// }
//   )},


addVoters: (e)=>{
    
 // e.preventDefault();
  
  let fullname=$('#fullname').val(); 
 // var nin=document.getElementById('nin').value; 
  let address=$('#address').val(); 
  let phonenumber =$('#phonenumber').val(); 
  let nin = $('#nin').val();
  let location = $('#location').val();
  
  var password =$('#key').val(); 

  let itemsArray=[];
  localStorage.setItem('items',JSON.stringify(itemsArray));
  const data = JSON.parse(localStorage.getItem('items'));

  itemsArray.push(location,nin,password);
  localStorage.setItem('items', JSON.stringify(itemsArray));

  data.forEach(item=>{
  App.addVoters(item);
  });
  alert('Voter Successfully Added')
  let response= confirm("Do you want to Add Another Voter");
  if(response){
    $('#fullname').val('');
    $('#address').val('');
    $('#phonenumber').val('');
    $('#location').val('');
    $('#nin').val('');  
    $('#key').val('');  
  }
  else{
    $("#content1").hide();     
    $("#loader1").show();
  }
},

  ValidateUSers: async ()=> 
      {  
        let myItems= JSON.parse(localStorage.getItem('items'));
        let location = $('#location').val();
         let newNin=$('#nin2').val();
         let newKey=$('#key2').val();
         
         if (!( newNin==myItems[1] && newKey==myItems[2]) ){
          alert('You are not registered or Incorrect Information');
          // $('#location').val('');
          $('#nin2').val('');
          $('#key2').val('');
          
          return;
          }
          if(( newNin==myItems[1] && newKey==myItems[2]) ){
            alert('You are Registered and you can proceed to vote');
            alert("your tokenID is "+myItems[0]+myItems[1])
            $('#nin2').val('');
          $('#key2').val('');         
          } 
          // var result=""; 
          // if(result==location ){
          //   // let instance = await App.contracts.Election.deployed(); 
          //   // let result = await instance.geToken();
          //   // if(result){
          //     alert("your token is "+location+"newNin")// or LA+result.args.token
          //   }
            // else{
            //   alert("your token is "+location+"newNin")
            // }
             document.getElementById('voting').style.display = 'block';
             document.getElementById('auth').style.display = 'none';
             document.getElementById('registration').style.display = 'none';
             document.getElementById('counting').style.display = 'none'; 
                   
            // })
           },    
    

      addCandidateDiv:function(){
        var currentDate = new Date();
        if(currentDate > App.registrationDeadline){
          alert('You cannot add candidates');
          return;
        }
        document.getElementById('auth').style.display = 'none';
        document.getElementById('voting').style.display = 'none';
        document.getElementById('addition').style.display = 'block';
        document.getElementById('registration').style.display = 'none';
        document.getElementById('counting').style.display = 'none';
      },

  // function called when the "Register Votters button is clicked" button is clicked
  registerDiv: function() 
  {
    // alert(App.registrationDeadline);
    var currentDate = new Date();
    if(App.registrationDeadline<currentDate){
      alert('registration has closed ');
      return;
    }
    document.getElementById('auth').style.display = 'none';
    document.getElementById('voting').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
    document.getElementById('counting').style.display = 'none';
  },

      // function called when the "Vote button is clicked" button is clicked
      authDiv: function() 
      {
        var currentDate = new Date();
        if(App.votingDeadline<currentDate){
          alert('voting has closed return');
          return;
        }
        document.getElementById('auth').style.display = 'block';
        document.getElementById('voting').style.display = 'none';
        document.getElementById('registration').style.display = 'none';
        document.getElementById('counting').style.display = 'none';
      },

    countVoteDiv: ()=>
     {
          var currentDate = new Date();
          if(App.votingDeadline>currentDate){
            alert('You can only count vote when the election is over');
            return;
          }
      document.getElementById('voting').style.display = 'none';
      document.getElementById('auth').style.display = 'none';
      document.getElementById('registration').style.display = 'none';
      document.getElementById('counting').style.display = 'block';
    },


    resetVoters:()=>
    {
      var sure= confirm("Are you sure you want to clear the data");
      if(sure){
        document.getElementById('fullname').value=""; 
        document.getElementById('nin').value=""; 
        document.getElementById('address').value=""; 
        document.getElementById('phonenumber').value=""; 
        document.getElementById('nin').value=""; 
        document.getElementById('password').value=""; 
      }
    }
};

$(()=> 
{
  $(window).load(()=>
   {
    App.init();
  });
});
