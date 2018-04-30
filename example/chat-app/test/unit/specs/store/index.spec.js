import Store from '@/store';

test('[object store]', ()=>{
  const store = Store.getStore();
  expect(store.state.me).not.toBeNull();
});

test('[store account]', ()=>{
  const store = Store.getStore();
  expect(store.state.account.username).toBe('elastos');

  store.commit('account/username', 'xyz');
  expect(store.state.account.username).toBe('xyz');
  store.commit('account/reset');
  expect(store.state.account.username).toBe('elastos');
});

test('[store me]', ()=>{
  const store = Store.getStore();

  const me = store.state.me;
  expect(me.info.name).toBe('NA');

  store.commit('me/info', {
    data : {
      name : 'xyz'
    }
  });
  store.commit('me/online', {
    data : {
      online : true
    }
  });

  store.commit('me/presence', {
    data : 2
  });

  store.commit('me/address', {
    data : 'address'
  });

  expect(me.info.name).toBe('xyz');
  expect(me.online).toBe(true);
  expect(me.presence).toBe(2);
  expect(me.address).toBe('address');

  store.commit('reset');
  expect(me.info.name).toBe('NA');
});

test('[store log]', ()=>{
  const store = Store.getStore();

  const log = store.state.log;

  store.commit('clear_log');
  store.commit('add_log', 'a');
  store.commit('add_error', 'b');

  expect(log.list.length).toBe(2);
  store.commit('reset');
  expect(log.list.length).toBe(0);

});

test('[store friend]', ()=>{
  const store = Store.getStore();
  const friend = store.state.friend;

  store.dispatch('carrier_data', {
    type : 'friend/list/callback',
    data : {
      info : {
        userId : 'a'
      }
    }
  });
  store.dispatch('carrier_data', {
    type : 'friend/list/callback',
    data : {
      end : 1
    }
  });
  expect(friend.list.length).toBe(1);

  store.dispatch('carrier_data', {
    type : 'friend/list',
    data : {}
  });
  store.dispatch('carrier_data', {
    type : 'friend/add',
    data : {
      address : 'address'
    }
  });

  store.dispatch('carrier_data', {
    type : 'friend/apply/callback',
    data : {
      userId : 'aaa',
      msg : 'aaa'
    }
  });

  store.dispatch('carrier_data', {
    type : 'friend/accept',
    data : {}
  });

  store.dispatch('carrier_data', {
    type : 'friend/remove',
    data : {}
  });

  store.dispatch('carrier_data', {
    type : 'friend/remove/callback',
    data : 'aaa'
  });

  store.commit('friend.current.set', {
    userId : 'a'
  });
  store.commit('friend.message.add', {
    key : 'a',
    msg : 'hello'
  });

  expect(store.getters.getFriendMessageList().length).toBe(1);
});