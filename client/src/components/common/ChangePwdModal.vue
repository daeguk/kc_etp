<template>
  <transition name="pwdchang-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h5>
              <i class="fas fa-unlock fa-fw"></i>비밀번호 변경
            </h5>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label class="form-control-label" for="oldpassword">Old Password</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fas fa-key fa-fw"></i>
                    </span>
                  </div>
                  <input
                    id="oldPwd"
                    name="oldPwd"
                    class="form-control"
                    type="password"
                    v-model.trim="oldPwd"
                  />
                </div>
              </div>
              <!-- /form-group -->
              <div class="form-group">
                <label class="form-control-label" for="newpassword">New Password</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fas fa-unlock fa-fw"></i>
                    </span>
                  </div>
                  <input
                    id="newPwd"
                    name="newPwd"
                    class="form-control"
                    type="password"
                    v-model.trim="newPwd"
                  />
                </div>
              </div>
              <!-- /form-group -->
              <div class="form-group">
                <label class="form-control-label" for="connewpassword">Re New Password</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fas fa-unlock-alt fa-fw"></i>
                    </span>
                  </div>
                  <input
                    id="reNewPwd"
                    name="reNewPwd"
                    class="form-control"
                    type="password"
                    v-model.trim="reNewPwd"
                  />
                </div>
              </div>
              <!-- /form-group -->
            </form>
          </div>
          <div class="modal-footer">
            <div class="tar" role="group">
              <button type="submit" class="btn btn-basic" @click="updatePwd">확인</button>
              <button type="submit" class="btn btn-cancel" @click="closePwdModal">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Config from '../../js/config.js'
  export default {
    props: ['userid'],
    data: function() {
      return {
        oldPwd: '',
        newPwd: '',
        reNewPwd: '',
      };
    },
    methods: {
      updatePwd: function() {
        console.log(this.userid);
        console.log(this.oldPwd);
        console.log(this.newPwd);
        console.log(this.reNewPwd);
        var vm = this;
        if(vm.oldPwd == '' || vm.newPwd == '' || vm.reNewPwd == '') {
          alert('PASSWORD 를 입력하세요.');
        } else if(vm.newPwd !== vm.reNewPwd) {
          alert('NEW PASSWORD 가 일치하지 않습니다.');
          vm.newPwd = '';
          vm.reNewPwd = '';
        } else {
          axios.post(Config.base_url + '/admin/pwdChange', {
            "userid": vm.userid,
            "oldPwd": vm.oldPwd,
            "newPwd": vm.newPwd,
          }).then(function(response) {
            console.log(response.data.success);
            if(response.data.success == true) {
              alert('비밀번호가 변경되었습니다.');
              vm.$EventBus.$emit("closePwdModal");
            } else {
              alert(response.data.message);
            }
          });
        }
      },
      closePwdModal: function() {
        this.$EventBus.$emit("closePwdModal");
      }
    }
  }
</script>
<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .1s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 400px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .1s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
*/
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .modal-header {
    margin-top: 0;
    padding: 10px 0 5px 0;
    color: #486bdf;
    border-bottom: 2px solid #111;
  }

  .modal-header h5 i::before {
    color: #2877c7;
  }

  .tar {
    text-align: right;
  }

  .btn-basic {
    background: #2877c7;
    color: #FFF;
    font-size: 1.0625rem;
    padding: 6px 16px 7px;
  }

  .btn-basic:hover {
    background: #145392;
  }

  .btn-cancel {
    background: #8c9dad;
    color: #FFF;
    font-size: 1.0625rem;
    padding: 6px 16px 7px;
  }

  .btn-cancel:hover {
    background: #66737e;
  }
</style>