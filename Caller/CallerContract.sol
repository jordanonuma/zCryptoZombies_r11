pragma solidity 0.5.0;
import "./EthPriceOracleInterface.sol";
import "/../Ownable.sol";

contract CallerContract is Ownable{
    EthPriceOracleInterface private oracleInstance;

    address private oracleAddress;
    mapping(uint256=>bool) myRequests;
    event ReceivedNewRequestIdEvent(uint256 id);
    event newOracleAddressEvent(address oracleAddress);
    
    function setOracleInstanceAddress(address _oracleInstanceAddress) public onlyOwner {
        oracleAddress = _oracleInstanceAddress;
        oracleInstance = EthPriceOracleInterface(oracleAddress);
        emit newOracleAddressEvent(oracleAddress);
    } //end function setOracleInstanceAddress()

    function updateEthPrice() public {
        uint256 id = oracleInstance.getLatestEthPrice();
        myRequests[id] = true;
        emit ReceivedNewRequestIdEvent(id);
    } //end function updateEthPrice()
} //end contract CallerContract{}