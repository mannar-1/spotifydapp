// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
 contract spotify{
     //music structure

    struct Music{
        string songname ;
        string murl;
        string image;
        string singer;
        
       
    }
   Music[] songs;

   address payable public owner;

     constructor(){
           owner=payable (msg.sender);

     }
     // to add music
     function add(string memory songname,string memory murl,string memory image,string memory singer) public payable {
            require(msg.value>0,"please pay > 0 eth");
        owner.transfer(msg.value);
        songs.push(Music (songname,murl,image,singer));
     }
     //to delete a song
     function deletesong(string memory name) public {
       for (uint i = 0; i < songs.length; i++) {
        string storage songName = songs[i].songname;
        if (keccak256(bytes(songName)) == keccak256(bytes(name))) {
            delete songs[i];
            break;
        }
    }
}
     //to get all songs
     function get() public view returns(Music  [] memory){
            return songs;

     }

}