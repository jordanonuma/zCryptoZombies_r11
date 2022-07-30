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

<<<<<<< HEAD
    constructor(address _owner) public { //modifier may be needed
=======
    constructor(address _owner) public { //modiifer may be needed
>>>>>>> 32b0f9c4673f5c9b88de69631f8cf7c077ac0744
        owners.add(_owner);
    } //end costructor()

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