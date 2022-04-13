# ------------------------------------------------------------------
# Licensed under the MIT License. See LICENSE in the project root.
# ------------------------------------------------------------------

"""
    Coalesce(value)

Replaces all missing values from the table with `value`.
"""
struct Coalesce{T} <: Colwise
  value::T
end

isrevertible(::Type{<:Coalesce}) = true

colcache(::Coalesce, x) = findall(ismissing, x)

colapply(tramsform::Coalesce, x, c) =
  coalesce.(x, tramsform.value)

colrevert(::Coalesce, x, c) =
  map(i -> i ∈ c ? missing : x[i], 1:length(x))