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
} //end contract CallerContract{}