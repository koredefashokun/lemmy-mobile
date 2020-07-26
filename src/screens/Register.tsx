import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { retryWhen, delay, take } from 'rxjs/operators';
import { WebSocketJsonResponse, LoginResponse } from '../interfaces';
import { wsJsonToRes } from '../utils';
import { i18n } from '../i18next';
import { SitesContext } from '../contexts/SitesContext';
import { AuthContext } from '../contexts/AuthContext';
import useWebSocketService from '../hooks/useWebSocketService';

const initialState = {
  username: undefined,
  password: undefined,
  password_verify: undefined,
  admin: false,
  show_nsfw: false
};

const Login = (props: any) => {
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState<string>('');

  const { activeSite } = React.useContext(SitesContext);
  const service = useWebSocketService({ activeSite, loading: false });
  const { setJwt } = React.useContext(AuthContext);

  const mathQuestion = {
    a: Math.floor(Math.random() * 10) + 1,
    b: Math.floor(Math.random() * 10) + 1
  };

  const mathCheck = Number(answer) !== mathQuestion.a + mathQuestion.b;

  const parseMessage = (msg: WebSocketJsonResponse) => {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      // toast(i18n.t(msg.error), 'danger');
      setState(initialState);
      return;
    } else {
      let data = res.data as LoginResponse;
      setState(initialState);
      setJwt(data.jwt);
      service?.userJoin();
      // toast(i18n.t('logged_in'));
      props.history.push('/');
    }
  };

  React.useEffect(() => {
    const subscription = service?.subject
      .pipe(retryWhen((errors) => errors.pipe(delay(3000), take(10))))
      .subscribe(
        parseMessage,
        (err) => console.error(err),
        () => console.log('complete')
      );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLoginSubmit = () => {
    setLoading(true);
    service?.login(state);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>{i18n.t('username')}</Text>
        <TextInput placeholder='johndoe' />
      </View>
      <View>
        <Text>{i18n.t('email')}</Text>
        <TextInput placeholder='test@test.com' />
      </View>
      <View>
        <Text>{i18n.t('password')}</Text>
        <TextInput placeholder='dfdfdfdfdfdf' secureTextEntry />
      </View>
      <View>
        <Text>{i18n.t('verify_password')}</Text>
        <TextInput placeholder='fdfdfjdfdkf' secureTextEntry />
      </View>
      <View>
        <Text>{`${i18n.t('what_is')} ${mathQuestion.a} + ${
          mathQuestion.b
        }?`}</Text>
        <TextInput
          placeholder='fdfdfjdfdkf'
          onChangeText={setAnswer}
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={handleLoginSubmit} disabled={mathCheck}>
        {loading ? <ActivityIndicator /> : <Text>{i18n.t('login')}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {},
  button: {}
});

export default Login;
