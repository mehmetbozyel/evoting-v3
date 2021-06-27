var web3 = new Web3();
var accountaddress;
var ballotContract;
var ballotByteCode;
var Ballot;
var ballotABI = [
	{
		"inputs": [],
		"name": "endVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "giveRightToVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "proposalNames",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposal",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "Voter",
				"type": "address"
			}
		],
		"name": "voteDone",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "voteEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "voteStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "voterAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "chairperson",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "enum Ballot.State",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCandidate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalVote",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalVoter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "weight",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "voted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "vote",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winnerName",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "winnerName_",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winningProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "winningProposal_",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
var voterTable;

$( document ).ready(function() {
    $('#kaleidorefresh').show();
    $('#panels_contract').hide();
    $('#panels_voters').hide();

       voterTable = $('#voterTable').DataTable( {
        columns: [
            { title: "Address" },
            //{ title: "Name" },
            { title: "Status" }
        ]
    } );
});

window.addEventListener('load', async () => {

    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            accountaddress = web3.givenProvider.selectedAddress;
            //show account address
            $('#account').html(accountaddress)
            
            ballotContract = new web3.eth.Contract(ballotABI);
            ballotByteCode = '0x608060405260008055600060015560006002553480156200001f57600080fd5b506040516200183e3803806200183e8339818101604052810190620000459190620002c6565b33600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160046000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000181905550805160008190555060005b8151811015620001b357600560405180604001604052808484815181106200014c577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151815260200160008152509080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001556020820151816001015550508080620001aa90620003ad565b915050620000fb565b506000600360006101000a81548160ff0219169083600281111562000201577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055505062000484565b6000620002246200021e8462000334565b6200030b565b905080838252602082019050828560208602820111156200024457600080fd5b60005b858110156200027857816200025d8882620002af565b84526020840193506020830192505060018101905062000247565b5050509392505050565b600082601f8301126200029457600080fd5b8151620002a68482602086016200020d565b91505092915050565b600081519050620002c0816200046a565b92915050565b600060208284031215620002d957600080fd5b600082015167ffffffffffffffff811115620002f457600080fd5b620003028482850162000282565b91505092915050565b6000620003176200032a565b905062000325828262000377565b919050565b6000604051905090565b600067ffffffffffffffff8211156200035257620003516200042a565b5b602082029050602081019050919050565b6000819050919050565b6000819050919050565b620003828262000459565b810181811067ffffffffffffffff82111715620003a457620003a36200042a565b5b80604052505050565b6000620003ba826200036d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415620003f057620003ef620003fb565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b620004758162000363565b81146200048157600080fd5b50565b6113aa80620004946000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636332abc91161008c578063b922394611610066578063b9223946146101f1578063c19d93fb146101fb578063e2ba53f014610219578063f1cea4c714610237576100cf565b80636332abc9146101855780639e7b8d61146101a3578063a3ec138d146101bf576100cf565b80630121b93f146100d4578063013cf08b146100f05780631812dab4146101215780632e4176cf1461013f5780634c0a6af01461015d578063609ff1bd14610167575b600080fd5b6100ee60048036038101906100e99190610dbf565b610255565b005b61010a60048036038101906101059190610dbf565b61049f565b604051610118929190610f3b565b60405180910390f35b6101296104d3565b604051610136919061103f565b60405180910390f35b6101476104d9565b6040516101549190610f05565b60405180910390f35b6101656104ff565b005b61016f61069c565b60405161017c919061103f565b60405180910390f35b61018d6107fa565b60405161019a919061103f565b60405180910390f35b6101bd60048036038101906101b89190610d96565b610800565b005b6101d960048036038101906101d49190610d96565b610a97565b6040516101e89392919061105a565b60405180910390f35b6101f9610ace565b005b610203610c6b565b6040516102109190610f64565b60405180910390f35b610221610c7e565b60405161022e9190610f20565b60405180910390f35b61023f610d66565b60405161024c919061103f565b60405180910390f35b6001806002811115610290577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff1660028111156102d8577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146102e257600080fd5b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060008160000154141561036d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036490610f7f565b60405180910390fd5b8060010160009054906101000a900460ff16156103bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103b690610fbf565b60405180910390fd5b60018160010160006101000a81548160ff021916908315150217905550828160020181905550600260008154809291906103f89061116f565b919050555080600001546005848154811061043c577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000209060020201600101600082825461045c91906110a2565b925050819055507f55c65cf9526efdf6c2252fe9757889dbd93e10172cad0f2edb1df619c88dbf7d336040516104929190610f05565b60405180910390a1505050565b600581815481106104af57600080fd5b90600052602060002090600202016000915090508060000154908060010154905082565b60005481565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080600281111561053a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff166002811115610582577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461058c57600080fd5b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461061c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106139061101f565b60405180910390fd5b6001600360006101000a81548160ff02191690836002811115610668577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055507fd0dc01800a369fef30d3fced5275b8b916549867622e79efca5245c479fda4ea60405160405180910390a150565b600060028060028111156106d9577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff166002811115610721577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461072b57600080fd5b6000805b6005805490508110156107f4578160058281548110610777577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600202016001015411156107e157600581815481106107c9577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600202016001015491508093505b80806107ec9061116f565b91505061072f565b50505090565b60015481565b600080600281111561083b577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff166002811115610883577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461088d57600080fd5b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461091d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091490610fdf565b60405180910390fd5b600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff16156109ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109a490610fff565b60405180910390fd5b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154146109fc57600080fd5b6001600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060016000815480929190610a579061116f565b91905055507fb9e5f9042e6c6eb94817f660cfa81afea9585e59d72bfc3348a2305cbd33e13382604051610a8b9190610f05565b60405180910390a15050565b60046020528060005260406000206000915090508060000154908060010160009054906101000a900460ff16908060020154905083565b6001806002811115610b09577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff166002811115610b51577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610b5b57600080fd5b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610beb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610be290610f9f565b60405180910390fd5b6002600360006101000a81548160ff02191690836002811115610c37577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055507f0deeca6c5a4a24936ed5053feb119562545a36119b158ecd0bb902a689be2d6660405160405180910390a150565b600360009054906101000a900460ff1681565b60006002806002811115610cbb577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600360009054906101000a900460ff166002811115610d03577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610d0d57600080fd5b6005610d1761069c565b81548110610d4e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b90600052602060002090600202016000015491505090565b60025481565b600081359050610d7b81611346565b92915050565b600081359050610d908161135d565b92915050565b600060208284031215610da857600080fd5b6000610db684828501610d6c565b91505092915050565b600060208284031215610dd157600080fd5b6000610ddf84828501610d81565b91505092915050565b610df1816110f8565b82525050565b610e008161110a565b82525050565b610e0f81611116565b82525050565b610e1e8161115d565b82525050565b6000610e31601483611091565b9150610e3c82611216565b602082019050919050565b6000610e54601e83611091565b9150610e5f8261123f565b602082019050919050565b6000610e77600e83611091565b9150610e8282611268565b602082019050919050565b6000610e9a602883611091565b9150610ea582611291565b604082019050919050565b6000610ebd601883611091565b9150610ec8826112e0565b602082019050919050565b6000610ee0602083611091565b9150610eeb82611309565b602082019050919050565b610eff81611153565b82525050565b6000602082019050610f1a6000830184610de8565b92915050565b6000602082019050610f356000830184610e06565b92915050565b6000604082019050610f506000830185610e06565b610f5d6020830184610ef6565b9392505050565b6000602082019050610f796000830184610e15565b92915050565b60006020820190508181036000830152610f9881610e24565b9050919050565b60006020820190508181036000830152610fb881610e47565b9050919050565b60006020820190508181036000830152610fd881610e6a565b9050919050565b60006020820190508181036000830152610ff881610e8d565b9050919050565b6000602082019050818103600083015261101881610eb0565b9050919050565b6000602082019050818103600083015261103881610ed3565b9050919050565b60006020820190506110546000830184610ef6565b92915050565b600060608201905061106f6000830186610ef6565b61107c6020830185610df7565b6110896040830184610ef6565b949350505050565b600082825260208201905092915050565b60006110ad82611153565b91506110b883611153565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156110ed576110ec6111b8565b5b828201905092915050565b600061110382611133565b9050919050565b60008115159050919050565b6000819050919050565b600081905061112e82611332565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061116882611120565b9050919050565b600061117a82611153565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156111ad576111ac6111b8565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f486173206e6f20726967687420746f20766f7465000000000000000000000000600082015250565b7f4f6e6c79206368616972706572736f6e2063616e20656e6420766f74652e0000600082015250565b7f416c726561647920766f7465642e000000000000000000000000000000000000600082015250565b7f4f6e6c79206368616972706572736f6e2063616e20676976652072696768742060008201527f746f20766f74652e000000000000000000000000000000000000000000000000602082015250565b7f54686520766f74657220616c726561647920766f7465642e0000000000000000600082015250565b7f4f6e6c79206368616972706572736f6e2063616e20737461727420766f74652e600082015250565b60038110611343576113426111e7565b5b50565b61134f816110f8565b811461135a57600080fd5b50565b61136681611153565b811461137157600080fd5b5056fea2646970667358221220fce9574773c094fdc8c8f8b5ebe716f1344f41bcee8bb5970f2081d70783ca9f64736f6c63430008040033';
            
            
        } catch (error) {
            // User denied account access...
            window.alert("Please connect to Metamask.")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});


var BallotContractAddress = "";
var MyTransactionHash;

function refreshContract(_contractAddress){
    loadBallotContract(_contractAddress);   
    var myBallot = new web3.eth.Contract(ballotABI, _contractAddress);
    var currentState = loadState(myBallot);
    
    if (currentState == 0){
        $('#panels_contract').show();
        $('#panels_voters').show();
        $("#btnStart").show();
        $("#btnEnd").hide();
        $("#loader").hide();
        $("#section_addVoter").show();                
    }
    else if (currentState == 1){
         $("#loaderStartVote").hide();
        $("#btnStart").hide();
        $("#btnEnd").show();
        $("#section_addVoter").hide();              
    }
    else if (currentState == 2){
        $("#loaderStartVote").hide();
        $("#btnEnd").hide();                
    }
    
}

function getContract(){
    web3.eth.getTransactionReceipt(MyTransactionHash)
    console.log("getContract çalıştı")
    .then((receipt) => {
        try{
            if (receipt.contractAddress){
                BallotContractAddress = receipt.contractAddress;
                loadBallotContract(BallotContractAddress);
                console.log(BallotContractAddress);
                $("#contractAddress").val(BallotContractAddress);
                watchVoteStarted(); //start watching for events
                watchVoterAdded(); //start watching for new voters
                watchVoteDone(); //start watching for vote done
                watchVoteEnd(); //start watching for vote end
                $('#panels_contract').show();
                $('#panels_voters').show();
                $("#btnStart").show();
                $("#btnEnd").hide();
                $("#loader").hide();
                $("#section_addVoter").show();
                return;                    
            }                    
        }
        catch(e){
            console.log("nope");
            window.setTimeout(getContract, 1000);  
        }
    }); 
}

//-------------- Watching Section -------------------//

function watchVoteEnd(){
    console.log("watchVoteEnd çalıştı")
    Ballot.events.voteEnded({
    }, (error, event) => { 
        console.log(event.returnValues.finalResult);
        loadState(Ballot);
        loadFinalResult(Ballot);
        $("#loaderStartVote").hide();
        $("#btnEnd").hide();
    })
    .on('data', (event) => {

    })
    .on('changed', (event) => {
        // remove event from local database
    })
    .on('error', console.error)                      
}

function watchVoteDone(){
    console.log("watchVoteDone çalıştı")
    Ballot.events.voteDone({
    }, (error, event) => { 
        console.log(event.returnValues.voter);
        updateNewVote(event.returnValues.voter);    
    })
    .on('data', (event) => {

    })
    .on('changed', (event) => {
        // remove event from local database
    })
    .on('error', console.error)           
}

var lastVoteAdded="";
function watchVoterAdded(){
    console.log("watchVoterAdded çalıştı")
    Ballot.events.voterAdded({
    }, (error, event) => { 
        console.log(event.returnValues.voter);
        loadTotalVoter(Ballot);
        
        //strange hack: this event fires twice for some reasons
        //so I save the last voter address and suppress it if
        //it is the same as the previous one :P
        if (lastVoteAdded != event.returnValues.voter){
            loadVoter(Ballot, event.returnValues.voter);
            lastVoteAdded = event.returnValues.voter;                    
        }

        $("#loaderNewVoter").hide();                
    })
    .on('data', (event) => {

    })
    .on('changed', (event) => {
        // remove event from local database
    })
    .on('error', console.error)
}

function watchVoteStarted(){
    console.log("watchVoteStarted çalıştı")
    Ballot.events.voteStarted({
    }, (error, event) => { })
    .on('data', (event) => {
        console.log(event.event); // same results as the optional callback above
        $("#loaderStartVote").hide();
        $("#btnStart").hide();
        $("#btnEnd").show();
        $("#section_addVoter").hide();
        loadState(Ballot);
    })
    .on('changed', (event) => {
        // remove event from local database
    })
    .on('error', console.error)
}

//-------------- Loading Section -------------------//

async function loadBallotContract(myBallotContractAddress){
    console.log("loadBallotContract çalıştı")
    Ballot = new web3.eth.Contract(ballotABI, myBallotContractAddress);
    
    loadFinalResult(Ballot);
    loadTotalVoter(Ballot);
    loadTotalVotes(Ballot);

    loadState(Ballot);
    
    $("#lbl_address").html("<b>Address: </b>" + myBallotContractAddress);           
};

async function loadFinalResult(myBallot){
    console.log("loadFinalResult çalıştı")
    myBallot.methods.winnerName().call().then((result) => {
        var str = web3.utils.toAscii(result);
        $("#lbl_result").html("<b>Result: </b>" + str);
    });
}

async function loadTotalVoter(myBallot){
    console.log("loadTotalVoter çalıştı")
    myBallot.methods.totalVoter().call().then((result) => {
        $("#lbl_voters_num").html("<b>Voters: </b>" + result);
    });
}

async function loadTotalVotes(myBallot){
    console.log("loadTotalVotes çalıştı")
    myBallot.methods.totalVote().call().then((result) => {
        $("#lbl_votes_num").html("<b>Votes: </b>" + result);
    });
}

async function loadState(myBallot){
    console.log("loadState çalıştı")
    myBallot.methods.state().call().then((result) => {
        if (result == 0){
            $("#lbl_state").addClass("label label-primary");
            $("#lbl_state").html("Created");                    
        }
        else if (result == 1){
            $("#lbl_state").addClass("label label-success");
            $("#lbl_state").html("Voting");                    
        }                
        else if (result == 2){
            $("#lbl_state").addClass("label label-danger");
            $("#lbl_state").html("Ended");                    
        } 
        return result;
    });
}

async function loadVoter(myBallot, _myVoterAddress){
    console.log("loadVoter çalıştı" + _myVoterAddress)
    myBallot.methods.giveRightToVote(_myVoterAddress).call().then((result) => {
        console.log("result => ",result);
        
        var voteStatus;
        if (result.voted){
            voteStatus = "<span class='label label-primary'>Voted</span>";
        }
        else {
            voteStatus = "<span class='label label-danger'>Not Voted</span>";
        }
        
        var newRow = voterTable.row.add( [
            _myVoterAddress,
            //result.voterName,
            voteStatus
        ] ).draw(false).node();
        $('td:eq(2)', newRow).attr('id', _myVoterAddress+"_cell");
        
    } );

}

function updateNewVote(_myVoterAddress){
    console.log("updateNewVote çalıştı")
    $("#" + _myVoterAddress+"_cell").html("<span class='label label-primary'>Voted</span>");  
    loadTotalVotes(Ballot);
}

//-------------- Button Section -------------------//

$("#btnEnd").click(async function(){
    $("#loaderStartVote").show();
    //Ballot = new web3.eth.Contract(ballotABI, BallotContractAddress);
    
    var mygas;
    Ballot.methods.endVote().estimateGas({from: accountaddress})
    .then(function(gasAmount){
        mygas = gasAmount;
    })
    
    Ballot.methods.endVote().send({
        from: accountaddress,
        gas: mygas, 
        gasPrice: web3.eth.gasPrice        	    
    })
    .on('transactionHash', (hash) => {
        console.log("a");
    })
    .on('receipt', (receipt) => {
        console.log("b");            
        
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("c");
    })
    .on('error', console.error);            
});

$("#btnStart").click(async function() {	
    $("#loaderStartVote").show();
    //Ballot = new web3.eth.Contract(ballotABI, BallotContractAddress);
    
    var mygas;
    Ballot.methods.startVote().estimateGas({from: accountaddress})
    .then(function(gasAmount){
        mygas = gasAmount;
    })
    
    Ballot.methods.startVote().send({
        from: accountaddress,
        gas: mygas, 
        gasPrice: web3.eth.gasPrice        	    
    })
    .on('transactionHash', (hash) => {
        console.log("a");
    })
    .on('receipt', (receipt) => {
        console.log("b");            
        
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("c");
    })
    .on('error', console.error);
});

$("#btnAdd").click(async function() {
    console.log("btnAdd çalıştı")

    $("#loaderNewVoter").show();
    console.log($("#txtNewVoterAddress").val());
    //console.log($("#txtNewVoterName").val());
    
    //Ballot = new web3.eth.Contract(ballotABI, BallotContractAddress);
    
    //estimate first
    var mygas;
    Ballot.methods.giveRightToVote($("#txtNewVoterAddress").val()).estimateGas({from: accountaddress})
    .then(function(gasAmount){
        mygas = gasAmount;
    })
    
    Ballot.methods.giveRightToVote($("#txtNewVoterAddress").val()).send({
        from: accountaddress,
        gas: mygas, 
        gasPrice: web3.eth.gasPrice       	    
    })
    .on('transactionHash', (hash) => {
        console.log("a");
    })
    .on('receipt', (receipt) => {
        console.log("b");          
        
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log("c");
    })
    .on('error', console.error);
    
});

$("#btnRefresh").click(async function(){
   refreshContract($("#contractAddress").val()); 
});

$("#btnGo").click(async function() {	
    $("#loader").show();
    var i = 0;
    var proposal = $("#candidateNames").val();
    var nameArr = proposal.split(',');
    console.log(nameArr)

    var nameBytes = [];

    for (let i = 0; i < nameArr.length; i++) {
        var inBytes = ethers.utils.formatBytes32String(nameArr[i]);
        nameBytes[i] = inBytes;
      }

    console.log(nameBytes)
    
    ballotContract.deploy({
        data: ballotByteCode,
        arguments: [nameBytes],
        //0x63616e6469646174653100000000000000000000000000000000000000000000,0x6332000000000000000000000000000000000000000000000000000000000000,0x6333000000000000000000000000000000000000000000000000000000000000
    })
    .send({
        from: accountaddress,
        gas: 1308700, 
        gasPrice: web3.eth.gasPrice,
        gasLimit: 2000000
    }, (error, transactionHash) => {
        MyTransactionHash = transactionHash;
        //getContract(); for private kaleido chain only
    })
    .on('error', (error) => { 
        console.log("b");            
    })
    .on('transactionHash', (transactionHash) => { 
        console.log("c", transactionHash);
    })
    .on('receipt', (receipt) => {
        console.log("DONE" + receipt.contractAddress); // contains the new contract address
        
        BallotContractAddress = receipt.contractAddress;
        loadBallotContract(BallotContractAddress);
        console.log(BallotContractAddress);
        $("#contractAddress").val(BallotContractAddress);
        watchVoteStarted(); //start watching for events
        watchVoterAdded(); //start watching for new voters
        watchVoteDone(); //start watching for vote done
        watchVoteEnd(); //start watching for vote end
        $('#panels_contract').show();
        $('#panels_voters').show();
        $("#btnStart").show();
        $("#btnEnd").hide();
        $("#loader").hide();
        $("#section_addVoter").show();
    })
    .on('confirmation', (confirmationNumber, receipt) => { 
        console.log(i);
        i++;
    })
    .then((newContractInstance) => {
        console.log(newContractInstance.options.address) // instance with the new contract address
    });
                
});