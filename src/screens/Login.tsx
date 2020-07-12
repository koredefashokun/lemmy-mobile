import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { retryWhen, delay, take } from 'rxjs/operators';
import {
  WebSocketJsonResponse,
  LoginResponse,
  UserOperation,
} from '../interfaces';
import { wsJsonToRes } from '../utils';
import { i18n } from '../i18next';
import authStyles from '../styles/auth';
import { AuthContext } from '../contexts/AuthContext';
import { colors } from '../styles/theme';
import { ServiceContext } from '../contexts/ServiceContext';

const initialState = {
  username_or_email: undefined,
  password: undefined,
};

const Login: React.FC = () => {
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );
  const [loading, setLoading] = React.useState(false);
  const service = React.useContext(ServiceContext);
  const { setJwt } = React.useContext(AuthContext);

  const parseMessage = (msg: WebSocketJsonResponse) => {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      // toast(i18n.t(msg.error), 'danger');
      setState(initialState);
      return;
    } else {
      if (res.op === UserOperation.Login) {
        let data = res.data as LoginResponse;
        setState(initialState);
        setJwt(data.jwt);
        service?.userJoin();
        // toast(i18n.t('logged_in'));
        // props.history.push('/');
      }
    }
  };

  React.useEffect(() => {
    const subscription = service?.subject
      .pipe(retryWhen((errors) => errors.pipe(delay(3000), take(10))))
      .subscribe(parseMessage, console.error, () => console.log('complete'));

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLoginSubmit = () => {
    setLoading(true);
    service?.login(state);
    setLoading(false);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.header}>{i18n.t('login')}</Text>
        <Text style={authStyles.label}>{i18n.t('email')}</Text>
        <TextInput
          style={authStyles.input}
          placeholder='john@doe.com'
          placeholderTextColor={colors.gray}
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={(usernameOrEmail) =>
            setState({ username_or_email: usernameOrEmail })
          }
        />
      </View>
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>{i18n.t('password')}</Text>
        <TextInput
          style={authStyles.input}
          placeholder='password'
          secureTextEntry
          placeholderTextColor={colors.gray}
          onChangeText={(password) => setState({ password })}
        />
      </View>
      <TouchableOpacity
        style={authStyles.button}
        onPress={handleLoginSubmit}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={authStyles.buttonText}>{i18n.t('login')}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
