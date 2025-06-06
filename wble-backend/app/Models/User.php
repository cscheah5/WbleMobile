<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
	/** @use HasFactory<\Database\Factories\UserFactory> */
	use HasFactory, Notifiable;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var list<string>
	 */
	protected $fillable = [
		'username',
		'name',
		'email',
		'password',
		'role',
		'profile_picture',
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var list<string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'email_verified_at' => 'datetime',
			'password' => 'hashed',
		];
	}

	/** 
	 * Get the identifier that will be stored in the subject claim of the JWT. 
	 * 
	 * @return mixed 
	 */
	public function getJWTIdentifier()
	{
		return $this->username;
	}

	/** 
	 * Return a key value array, containing any custom claims to be added to 
	 * 
	 * @return array 
	 */
	public function getJWTCustomClaims()
	{
		return [];
	}

	public function getAuthIdentifierName()
	{
		return 'username';
	}

	public function enrollments()
	{
		return $this->hasMany(Enrollment::class);
	}

	public function teachings()
	{
		return $this->hasMany(Teaching::class);
	}
}
