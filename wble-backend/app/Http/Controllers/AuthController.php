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
use Illuminate\Support\Str;

use Illuminate\Routing\Controller;

class AuthController extends ApiController
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    // Admin register new user
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:30|unique:users',
            'password' => 'required|string|min:6',
            'email' => 'required|string|email|max:255',
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:student,lecturer,admin',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        if ($request->hasFile('profile_picture')) {
            $path = "/storage/" . $request->file('profile_picture')->store('profile_pictures', 'public');
        } else {
            $path = '/images/default.jpg';
        }

        $user = User::create([
            'username' => $request->get('username'),
            'password' => Hash::make($request->get('password')),
            'email' => $request->get('email'),
            'name' => $request->get('name'),
            'role' => $request->get('role'),
            'profile_picture' => $path,
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user
        ]);
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

            // Generate a new random refresh token (not JWT)
            $refreshToken = Str::random(64);

            // Store refresh token in database
            $user->refresh_token = $refreshToken;
            $user->refresh_token_expires_at = now()->addDays(7); // 7-day expiry
            $user->save();

            return $this->createNewToken($token, $user, $refreshToken);
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

        return $this->successResponse([
            'user' => $user->makeHidden(['fcm_token'])
        ]);
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
        $refreshToken = request('refresh_token');
        $user = User::where('refresh_token', $refreshToken)
        ->where('refresh_token_expires_at', '>', now()) // Check expiry
        ->first();

        if (!$user) {
            return $this->errorResponse('Invalid refresh token', 401);
        }

        // Generate new tokens
        $newAccessToken = JWTAuth::fromUser($user);
        $newRefreshToken = Str::random(64); // Generate a new refresh token

        // Update DB
        $user->refresh_token = $newRefreshToken;
        $user->save();

        return $this->createNewToken($newAccessToken, $user, $newRefreshToken);
    }

    protected function createNewToken($token, $user, $refreshToken)
    {
        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // 60 minutes
            'issued_at' => now()->timestamp,
            'refresh_token' => $refreshToken, // 14 days
            'user' => $user->only(['id', 'username', 'role'])
        ]);
    }
}
