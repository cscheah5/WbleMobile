<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

use Illuminate\Routing\Controller;

class AuthController extends ApiController
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:30|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'username' => $request->get('username'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return $this->createNewToken($token, $user);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return $this->errorResponse('Invalid credentials', 401);
            }

            // Get the authenticated user.
            $user = JWTAuth::user();

            return $this->createNewToken($token, $user);
        } catch (JWTException $e) {
            return $this->errorResponse('Could not create token', 500);
        }
    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return $this->errorResponse('User not found', 404);
            }
        } catch (JWTException $e) {
            return $this->errorResponse('Invalid token', 400);
        }

        return $this->successResponse(compact('user'));
    }

    // User logout
    public function logout()
    {

        // Get the currently authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Optional: Check if user exists (in case token is invalid/expired)
        if ($user) {
            // Clear FCM token from database
            $user->fcm_token = null;
            $user->save();
        }

        JWTAuth::invalidate(JWTAuth::getToken());

        return $this->successResponse([], 'Successfully logged out');
    }

    public function refresh()
    {
        try {
            // Parse the existing token
            $currentToken = JWTAuth::getToken();

            if (! $currentToken) {
                return $this->errorResponse('Token not provided', 400);
            }

            // Refresh the token (invalidates old one)
            $newToken = JWTAuth::refresh($currentToken);

            // Authenticate user based on old token
            $user = JWTAuth::setToken($newToken)->toUser();

            return $this->createNewToken($newToken, $user);
        } catch (TokenExpiredException $e) {
            return $this->errorResponse('Token expired', 401);
        } catch (TokenInvalidException $e) {
            return $this->errorResponse('Token invalid', 401);
        } catch (JWTException $e) {
            return $this->errorResponse('Could not refresh token', 500);
        }
    }

    protected function createNewToken($token, $user)
    {
        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // 60 minutes
            'issued_at' => now()->timestamp,
            'refresh_token' => JWTAuth::claims(['type' => 'refresh'])->fromUser($user), // 14 days
            'user' => $user->only(['id', 'username', 'role'])
        ]);
    }
}
