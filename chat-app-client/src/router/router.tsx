/* eslint no-unused-vars: 0 */
import { LoginPage } from 'components/loginPage';
import { RegisterUserPage } from 'components/registerUserPage';
import { TopPage } from 'components/topPage';
import React, { memo, FC } from 'react';
import { Switch, Route } from 'react-router-dom';

// eslint-disable-next-line react/display-name
export const Router: FC = memo(() => {
  return (
    <Switch>
      <Route exact path="/">
        <LoginPage />
      </Route>
      <Route path="/top">
        <TopPage />
      </Route>
      <Route path="/register">
        <RegisterUserPage />
      </Route>
    </Switch>
  );
});
