pragma solidity >=0.8.13;

import "./ZombieFeeding.sol";

contract ZombieHelper is ZombieFeeding {

    modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
    } //end modifier aboveLevel()

    function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
        require(msg.sender = zombieToOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
    } //end function changeName()

    function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
        require(msg.sender = zombieToOwner[_zombieId]);
        zombies[_zombieId].dna = _newDna;
    } //end function changeDna()
} //end contract ZombieHelper{}