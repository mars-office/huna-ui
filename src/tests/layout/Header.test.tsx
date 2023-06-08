import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../layout/Header";
import { AuthContextProps } from "oidc-react";
import { BrowserRouter } from "react-router-dom";

describe("Header", () => {
  it("Should show logo", () => {
    const mockAuthContext = {
      userData: {},
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const logoElement = screen.getByTestId("logo");
    expect(logoElement).toBeVisible();
  });


  it("Should show user menu button", async () => {
    const mockAuthContext = {
      userData: {},
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    expect(userMenuButton).toBeVisible();
  });

  it("Should show login button when user not logged in", async () => {
    const mockAuthContext = {
      userData: {},
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    fireEvent.click(userMenuButton);
    const loginButton = screen.queryByTestId("loginButton");
    expect(loginButton).not.toBeNull()
    expect(loginButton).toBeVisible();
  });

  it("Should not show login button when user logged in", async () => {
    const mockAuthContext = {
      userData: {
        profile: {
          email: 'asd@asd.com'
        }
      },
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    fireEvent.click(userMenuButton);
    
    const loginButton = screen.queryByTestId("loginButton");
    expect(loginButton).toBeNull();
  });

  it("Should show logout button when user logged in", async () => {
    const mockAuthContext = {
      userData: {
        profile: {
          email: 'asd@asd.com'
        }
      },
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    fireEvent.click(userMenuButton);
    
    const logoutButton = screen.queryByTestId("logoutButton");
    expect(logoutButton).not.toBeNull();
    expect(logoutButton).toBeVisible();
  });

  it("Should logout user when user logged in and logout button is clicked", async () => {
    let mockAuthContext = {
      userData: {
        profile: {
          email: 'asd@asd.com',
          name: 'Test'
        }
      }
    } as AuthContextProps;
    mockAuthContext.signOut = async () => {
      mockAuthContext = {...mockAuthContext, userData: null}
    }
    const {rerender} = render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    fireEvent.click(userMenuButton);
    const logoutButton = screen.getByTestId("logoutButton");
    fireEvent.click(logoutButton);
    rerender(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    fireEvent.click(userMenuButton);
    const userNameText = screen.getByTestId("userName");
    expect(userNameText.textContent).toBe('Anonymous');
  });

  it("Should show Anonymous when user not logged in", async () => {
    const mockAuthContext = {
      userData: {
      },
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    
    fireEvent.click(userMenuButton);
    
    const userNameText = screen.getByTestId("userName");
    expect(userNameText.textContent).toBe('Anonymous');
  });

  it("Should show user name when user logged in", async () => {
    const mockAuthContext = {
      userData: {
        profile: {
          email: 'asd@asd.com',
          name: 'Test'
        }
      },
    } as AuthContextProps;
    render(
      <BrowserRouter>
        <Header auth={mockAuthContext} />
      </BrowserRouter>
    );
    const userMenuButton = screen.getByTestId("usermenu");
    
    fireEvent.click(userMenuButton);
    
    const userNameText = screen.getByTestId("userName");
    expect(userNameText.textContent).toBe('Test');
  });
});
