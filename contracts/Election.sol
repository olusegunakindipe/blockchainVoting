//solium-disable linebreak-style
pragma solidity ^0.5.0;
contract Election{
    
    // The address of the account that created this ballot.
     address public ballotCreator;

    constructor() public { 
        ballotCreator = msg.sender;    
        addCandidate(1,"Muhammed Buhari","All Progressive Party",0);
        addCandidate(2,"Atiku Abubakar","Peoples Democratic Party",0);
       //auctionEnd = now + (durationMins + 1 minutes);
    }
    
    //event AddedVoters(address indexed _sender, uint numVoters,bytes32 fullname,bytes32 nin,bytes32 addr,uint candidateIDVote,bool hasVoted);
    //Candidate[] public candidates;

    // Is voting finished? The ballot creator determines when to set this flag.
    bool public votingEnded;

    //event to add voters
    event addedVoters (bytes32 nin);
    // event Token(bytes32 token);
    event votedEvent (uint indexed _candidateId);
    event Deposit(address sender, uint256 amount);
    event Withdrawal (address receiver, uint256 amount);
    event Transfer(address from, address to, uint256 value);

    //mapping each candidate to their respective id
    mapping(uint => Candidate) public candidates;
    //mapping each voter to the Voter struct
    mapping(uint => Voter) public voters;
    //mapping that connects a voter to an address
    mapping(address => bool) public voted;
    mapping(address => uint256) public balances;

 
// The total number of votes cast so far. Revealed before voting has ended.
    uint256 public totalVotes;

    uint  candidatesCount;
    bytes32 token;
    uint  numVoters;
    bytes32 voterList;
    //address public OfficialAccount = App.account;
    //uint256 bonus = 1 wei;
    //uint durationMins= 60;    
 
    struct Candidate{
        uint id;
        string name;
        string party;
        uint voteCount;
      
    }

    struct Voter{
        uint id;
        bytes32 fullname; // bytes32 type are basically strings
        bytes32 nin;
        bytes32 addr;
        bytes32 phoneno;
        uint candidateIDVote;
        bool hasVoted;    
        //address myAccount;
    }    

    function addVoter(bytes32 fullname,bytes32 phoneno, bytes32 nin,bytes32 addr) public {//returns(uint) {
        //if(validVoter(nin) == true) {
        numVoters++;
        emit addedVoters(nin);
        voters[numVoters] = Voter(numVoters,fullname,nin,phoneno, addr,0,false);
    }

    function addCandidate (uint id, string memory _name, string memory party,uint voteCount) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, party, 0);
    }

    function vote (uint _candidateId) public {
        //require that they havent voted
        require(!voted[msg.sender]);
        // can only vote during voting period
        // require(!votingEnded);
         // candidate must be part of the ballot
        // require(validCandidate(_candidateId));

        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // require(totalVotes < ~uint256(0));

        require(candidates[_candidateId].voteCount < ~uint256(0));
        voted[msg.sender] = true;
        
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);

    } 
    
   
    // function deposit() payable public returns (bool success) {
    //     balances[msg.sender] +=msg.value;
    //     emit Deposit(msg.sender, msg.value);
    //     return true;
    // }

    // function withdraw(uint value) public  returns(bool success){
    //     require(balances[msg.sender] < value);
    //     balances[msg.sender]-=value;
    //     msg.sender.transfer(value);
    //     emit Withdrawal(msg.sender, value);
    //     return true;
    // }
    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
    function deposit(uint256 amount) payable public {
        require(msg.value == amount);
        // nothing else to do!
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
//  function transfer(address payable to, uint256 value) payable public returns (bool) {
//          require (balances[msg.sender] < value) ;
//          balances[msg.sender]-=value;
//          msg.sender.transfer(value);
//        emit Transfer(msg.sender, to, value);
//         return true;
//     }

    // function geToken() public returns (bytes32) {
    //     emit Token(token);
    //     return token;
    // }
    // function Award(address from) payable public returns (bool){
    //     //require(_to != address(0));
    //     from.transfer(bonus);
    //     return true;
    // }

    /* function Award(address from, address coinAddress, address to) public returns(bool){
        coinAddress.call(id,from,to,bonus)
        return true;
    }    */ 

    /* function Award() public payable {
        OfficialAccount = msg.sender;
    }
  
    function Award1() public payable {
          require(msg.value >= bonus);
          if (msg.value > bonus) {
               var Bonus = msg.value - bonus;
            msg.sender.transfer(Bonus);
        }
    } */
    
    //  function endVoting() public returns (bool) {
    //      // Only ballot creator can end the vote.
    //      require(msg.sender == ballotCreator);
    //     votingEnded = true;
    //     return true;
    // }

    //  function totalVotesFor(uint _candidateId) view public returns (uint256) {
    //     require(validCandidate(_candidateId));
    //      // Don't reveal votes until voting has ended
    //      require(votingEnded); 
    //     return candidates[_candidateId].voteCount;
    // }


     function getNumOfCandidates() public view returns(uint) {
        return candidatesCount;
    }

    // function validCandidate(uint _candidateId) view public returns (bool) {
    //     for(uint i = 0; i <candidatesCount; i++) {
    //         if (candidates[_candidateId].id == _candidateId) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }


    function getAccount(address account)view public returns(uint256){
        return account.balance;}

//can delete
//     function compare (string memory oldnin, string memory newnin) public pure returns (bool){
      
//        return keccak256(abi.encodePacked(oldnin)) == keccak256(abi.encodePacked(newnin));
//    }
}
