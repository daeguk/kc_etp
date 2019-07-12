var tool = {    

  chkEmail: function(str) {
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (regExp.test(str)) return true;
    else return false;
  
  },
}  
export default tool