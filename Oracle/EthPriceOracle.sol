pragma solidity 0.5.0;
import "/../Ownable.sol";
import "./CallerContractInterface.sol";
import "./Roles.sol";

contract EthPriceOracle {
    using Roles for Roles.Role;

    Roles.Role private owners; //contract owner
    Roles.Role private oracles;

    uint private randNonce = 0;
    uint private modulus = 1000;
    mapping(uint256=>bool) pendingRequests;
    event GetLatestEthPriceEvent(address callerAddress, uint id);
    event SetLatestEthPriceEvent(uint256 ethPrice, address callerAddress);
    event AddOracleEvent(address oracleAddress);

    constructor(address _owner) public { //modifier may be needed
        owners.add(_owner); //adds to owners() role--moving to next commit
    } //end costructor()

    function addOracle(address _oracle) public {
        require(owners.has(msg.sender), "Not an owner!");
        require(!oracles.has(_oracle), "Already an oracle!");
        oracle.add(_oracle);
        emit AddOracleEvent(_oracle);
    } //end function addOracle()

    function getLatestEthPrice() public returns (uint256) {
        randNonce++;
        uint id = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % modulus;
        pendingRequests[id] = true;
        emit GetLatestEthPriceEvent(msg.sender, id);
        return id;
    } //end function getLatestEthPrice()

    function setLatestEthPrice(uint256 _ethPrice, address _callerAddress, uint256 _id) public onlyOwner {
        require(pendingRequests[id] == true, "This request is not in my pending list.");
        delete pendingRequests[id];

        CallerContractInterface callerContractInstance;
        callerContractInstance = CallerContractInterface(_callerAddress);
        callerContractInstance.callback(_ethPrice, _id);
        emit SetLatestEthPriceEvent(_ethPrice, _callerAddress);
    } //end function setLatestEthPrice()
} //end contract EthPriceOracle{}